import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { Button, DatePicker, Input, Select, Space, Skeleton } from "antd";
import ReusableInput from "./reusableInput";
// import MoreFilter from "../../pages/tenantadmin/tracking/filters";
import { useRef } from "react";
import {
  disabledDate,
  formatDateForIndex,
  generateOptions,
  generateOptionsObject,
} from "@/util/reusableFunction";

import ReusableIntegerInput from "./reusableInput/integerInput";
import { filterType } from "@/models/reusableFilter";
import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";
const { RangePicker } = DatePicker;

const ReusableFilters = ({
  FilterItems,
  //search
  setSearchText,
  searchText,
  setPageNo,
  //select
  setSelectedOption,
  selectedOption,
  //dateRange
  setSelectedDateRanges,
  setSelectedDates,
  selectedDates,
  showFilter,
  search,
  setSearch,
  columns,
  tableLoader,
}: filterType) => {
  const pickerRefs = useRef<
    Record<string, HTMLInputElement | { focus?: () => void } | null>
  >({});
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const [multiSelect, setMultiSelect] = useState<
    Record<string, string | string[]> | undefined
  >();

  // Stabilized state variables for overflow detection
  const [containerWidth, setContainerWidth] = useState(0);
  const [isWidthMeasured, setIsWidthMeasured] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFilterOperation = useRef(false);
  const filterOperationTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleFocusPicker = (title: string) => {
    setTimeout(() => pickerRefs.current[title]?.focus?.(), 100);
  };

  const savedFocus = useRef<{ id: string | number; pos: number } | null>(null);
  const prevLoader = useRef(false);

  const markFilterOperation = useCallback(() => {
    isFilterOperation.current = true;
    if (filterOperationTimeout.current) {
      clearTimeout(filterOperationTimeout.current);
    }
    filterOperationTimeout.current = setTimeout(() => {
      isFilterOperation.current = false;
    }, 2000);
  }, []);

  useEffect(() => {
    const save = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === "INPUT") {
        const id = target.getAttribute("data-testid") || target.id;
        if (id) {
          savedFocus.current = { id, pos: target.selectionStart || 0 };
        }
      }
    };
    document.addEventListener("input", save);
    return () => document.removeEventListener("input", save);
  }, []);

  useEffect(() => {
    const focus = savedFocus.current;
    if (
      !tableLoader &&
      prevLoader.current &&
      focus &&
      !isFilterOperation.current
    ) {
      setTimeout(() => {
        const input =
          document.querySelector(`input[data-testid="${focus.id}"]`) ||
          document
            .querySelector(`[data-testid="${focus.id}"]`)
            ?.querySelector("input");
        const inputEl = input as HTMLInputElement | null;
        if (inputEl) {
          inputEl.focus();
          const pos = Math.min(focus.pos, inputEl.value?.length || 0);
          try {
            inputEl.setSelectionRange(pos, pos);
          } catch {}
        }
      }, 100);
    }
    prevLoader.current = tableLoader;
  }, [tableLoader]);

  useEffect(() => {
    return () => {
      if (filterOperationTimeout.current) {
        clearTimeout(filterOperationTimeout.current);
      }
    };
  }, []);

  const [selectAll, setSelectAll] = useState(false);
  //   const handleClearAllFilters = () => {
  //     setClear(true);
  //     setSearchText(null);
  //     setSelectedDateRanges({});
  //     setSelectedDates([]);
  //     setSelectedOption({});
  //   };
  //   const handleClearFilters = () => {
  //     setSelectAll(false);
  //     setActiveFilters((prevFilters) =>
  //       prevFilters.map((filter) => ({ ...filter, active: true }))
  //     );
  //     setSelectedDateRanges({});
  //     setSelectedDates([]);
  //     setSelectedOption({});
  //     setSearchText(null);
  //   };

  const handleRangePicker = (
    dates: Dayjs[] | null,
    dateString: string[],
    tabName: string,
  ) => {
    markFilterOperation();
    const formattedDates = dateString?.map((date, index) =>
      formatDateForIndex({ date: date, index: index }),
    );

    setSelectedDates?.((prevOptions) => ({
      ...prevOptions,
      [tabName]: dates,
    }));
    setSelectedDateRanges?.((prevOptions) => ({
      ...prevOptions,
      [tabName]: { startDate: formattedDates[0], endDate: formattedDates[1] },
    }));
    setPageNo?.(0);
  };

  // FIXED: Move activeFilterItems declaration BEFORE getInitialFiltersPerLine
  const activeFilterItems = FilterItems?.filter((item) => item?.active) || [];

  // FIXED: Calculate initial filters per line based on window width to prevent initial layout issues
  const getInitialFiltersPerLine = useCallback(() => {
    if (typeof window === "undefined") {
      return 3; // Default fallback for SSR
    }

    const windowWidth = window.innerWidth;
    let filterWidth = 220; // Default width from CSS

    // Check responsive breakpoints
    if (windowWidth <= 1100) {
      filterWidth = 192;
    } else if (windowWidth <= 1400) {
      filterWidth = 224;
    }

    const filterWidthWithMargin = filterWidth + 15;
    const availableWidth = windowWidth * 0.98 - 20; // Use window width as fallback
    const filtersPerLine = Math.floor(availableWidth / filterWidthWithMargin);

    // FIXED: Add null check for activeFilterItems
    const activeItemsLength = activeFilterItems?.length || 0;
    return Math.max(1, Math.min(filtersPerLine, activeItemsLength));
  }, [activeFilterItems]); // FIXED: Use optional chaining in dependency

  // Debounced width measurement function
  const debouncedMeasureContainer = useCallback(() => {
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }

    measureTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetWidth = containerRef.current.offsetWidth;
        const clientWidth = containerRef.current.clientWidth;

        // Try multiple measurement methods and use the largest valid one
        const measurements = [
          rect.width,
          offsetWidth,
          clientWidth,
          containerRef.current.scrollWidth,
        ].filter((width) => width > 0);

        const measuredWidth = Math.max(...measurements);

        // Get window width for comparison
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1200;
        const expectedMaxWidth = windowWidth * 0.98; // 98% of window width

        // If measured width is significantly smaller than expected, use window-based calculation
        let finalWidth = measuredWidth;
        if (measuredWidth < expectedMaxWidth * 0.8) {
          finalWidth = expectedMaxWidth;
        }

        // Only update if we get a valid width and it's significantly different
        // Use functional update to avoid dependency on containerWidth
        setContainerWidth((prevWidth) => {
          if (finalWidth > 0 && Math.abs(finalWidth - prevWidth) > 20) {
            setIsWidthMeasured(true);
            return finalWidth;
          } else if (finalWidth > 0) {
            setIsWidthMeasured((prevMeasured) => {
              if (!prevMeasured) {
                return true;
              }
              return prevMeasured;
            });
            return prevWidth;
          }
          return prevWidth;
        });
      }
    }, 50);
  }, []); // Empty deps - function doesn't depend on state

  // Measure container width on mount and resize - FIXED: Removed containerWidth from dependencies
  useLayoutEffect(() => {
    const measureContainer = () => {
      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          debouncedMeasureContainer();
        });
      } else {
        debouncedMeasureContainer();
      }
    };

    // FIXED: Immediate measurement for initial render
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1200;
        const expectedMaxWidth = windowWidth * 0.98;
        setContainerWidth(Math.max(rect.width, expectedMaxWidth));
        setIsWidthMeasured(true);
      }
    }

    // Initial measurement
    measureContainer();

    // Set up listeners
    const handleResize = () => {
      setIsWidthMeasured(false); // Reset measurement flag
      measureContainer();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      // Listen for zoom changes
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleResize);
      }
    }

    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", handleResize);
        }
      }
    };
  }, [showFilter, activeFilterItems.length]); // Removed debouncedMeasureContainer to prevent loops

  // Stabilized function to calculate filters per line
  const calculateFiltersPerLine = useMemo(() => {
    // If width not measured yet, use initial calculation based on window width
    if (!isWidthMeasured || containerWidth === 0) {
      return getInitialFiltersPerLine();
    }

    // Get filter width based on screen size - check CSS breakpoints
    let filterWidth = 220; // Default width from CSS

    // Check if we're in responsive breakpoints
    if (typeof window !== "undefined") {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 1100) {
        filterWidth = 192; // From CSS: @media (max-width: 1100px)
      } else if (windowWidth <= 1400) {
        filterWidth = 224; // From CSS: @media (min-width: 1101px) and (max-width: 1400px)
      }
    }

    // Add margin/gap between filters
    const filterWidthWithMargin = filterWidth + 15;
    const availableWidth = containerWidth - 20; // Account for container padding

    // Calculate how many filters fit in one line
    const filtersPerLine = Math.floor(availableWidth / filterWidthWithMargin);
    const result = Math.max(
      1,
      Math.min(filtersPerLine, activeFilterItems?.length || 0),
    );

    return result;
  }, [
    containerWidth,
    activeFilterItems?.length,
    isWidthMeasured,
    getInitialFiltersPerLine,
  ]);

  // Logic to determine which filters to show - FIXED: More stable logic
  const filtersPerLine = calculateFiltersPerLine;
  const shouldShowExpandButton =
    isWidthMeasured && (activeFilterItems?.length || 0) > filtersPerLine;

  // Toggle function for expand/collapse
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // FIXED: Use CSS-based hiding instead of conditional rendering to prevent layout shifts
  const getFilterStyle = (index: number) => {
    if (!shouldShowExpandButton) {
      return {}; // Show all filters
    }

    if (isExpanded) {
      return {}; // Show all filters when expanded
    }

    // Hide filters beyond the first line using CSS instead of conditional rendering
    if (index >= filtersPerLine) {
      return {
        display: "none",
        opacity: 0,
        height: 0,
        overflow: "hidden",
        margin: 0,
        padding: 0,
      };
    }

    return {};
  };
  const showSkeleton = !FilterItems;

  // Update multiSelect when selectedOption changes, but only if different
  useEffect(() => {
    const multiSelect = () => {
      const currentStr = JSON.stringify(selectedOption);
      const multiSelectStr = JSON.stringify(multiSelect);
      if (currentStr !== multiSelectStr) {
        setMultiSelect(selectedOption);
      }
    };
    multiSelect();
  }, [selectedOption]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {showSkeleton ? (
        <div className="grid grid-cols-7 ">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-2 me-3" style={{ width: "166px" }}>
              <Skeleton.Input
                active
                size="small"
                className="w-100 mb-2"
                style={{ height: "20px" }}
              />
              <Skeleton.Input
                active
                size="default"
                className="w-100"
                style={{ height: "32px" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div
            ref={containerRef}
            className="grid grid-cols-7 gap-x-5"
            style={{ width: showFilter ? "98%" : "auto" }}
          >
            {activeFilterItems.map((item, index) => {
              // FIXED: Use CSS-based styling instead of conditional rendering
              const filterStyle = getFilterStyle(index);
              const filterClass = `default-filter-size mb-2`;

              switch (item?.filter?.style) {
                case "SEARCH":
                  return (
                    <div
                      key={item?.headerName + index}
                      className={filterClass}
                      style={filterStyle} // FIXED: Apply stable styling
                    >
                      <label className="responsiveLabel font-bold px-1">
                        {item?.headerName}
                      </label>
                      <ReusableInput
                        placeholder={`Search ${item?.headerName}`}
                        value={searchText ? searchText[item?.actualField] : ""}
                        isSearch={true}
                        setSearchText={(val: string | null) => {
                          markFilterOperation();
                          if (setSearchText)
                            setSearchText((prev) => ({
                              ...prev,
                              [item?.actualField]: val ?? "",
                            }));
                          if (setPageNo) setPageNo(1);
                        }}
                        setPageNumber={setPageNo}
                        isMrnNumber={item?.actualField == "mrNumber"}
                        isIntAllow={
                          item?.actualField == "patientName" ||
                          item?.actualField == "name" ||
                          item?.actualField == "userName"
                        }
                      />
                    </div>
                  );
                case "DROP_DOWN":
                  return (
                    <div
                      key={item?.headerName}
                      className={filterClass}
                      style={filterStyle} // FIXED: Apply stable styling
                    >
                      <label className="responsiveLabel font-bold px-1">
                        {item?.headerName}
                      </label>
                      <div>
                        <div className="form-group has-search customClear">
                          <Select
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            showSearch={
                              (item as typeof item & { showSearch?: boolean })
                                ?.showSearch || false
                            }
                            className="custom-react-select-audit"
                            options={
                              item?.filter?.nameOptions
                                ? generateOptionsObject(
                                    item?.filter?.nameOptions,
                                  )
                                : generateOptions(item?.filter?.options) || []
                            }
                            placeholder={`Select ${item?.headerName}`}
                            value={selectedOption?.[item?.actualField] || null}
                            onChange={(value) => {
                              markFilterOperation();
                              if (setSelectedOption)
                                setSelectedOption((prevOptions) => ({
                                  ...prevOptions,
                                  [item?.actualField]: value,
                                }));
                              if (setPageNo) setPageNo(0);
                            }}
                            allowClear
                          />
                        </div>
                      </div>
                    </div>
                  );
                case "MULTI_SELECT":
                  return (
                    <div
                      key={item?.headerName}
                      className={filterClass}
                      style={filterStyle} // FIXED: Apply stable styling
                    >
                      <label className="responsiveLabel font-bold px-1">
                        {item?.headerName}
                      </label>
                      <div>
                        <div className="form-group has-search custom-react-select-audit multiSelect customClear">
                          <Select
                            maxTagCount={1}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            showSearch={
                              (item as typeof item & { showSearch?: boolean })
                                ?.showSearch || false
                            }
                            className="custom-react-select-audit w-100"
                            options={
                              item?.filter?.nameOptions
                                ? generateOptionsObject(
                                    item?.filter?.nameOptions,
                                  )
                                : generateOptions(item?.filter?.options) || []
                            }
                            placeholder={`Select ${item?.headerName}`}
                            value={multiSelect?.[item?.actualField] || null}
                            onChange={(value) =>
                              setMultiSelect((prevOptions) => ({
                                ...prevOptions,
                                [item?.actualField]: value,
                              }))
                            }
                            mode="multiple"
                            allowClear
                            popupRender={(menu) => (
                              <>
                                {menu}
                                <div className="flex justify-content-end gap-2 border-top p-1">
                                  <Button
                                    onClick={() => {
                                      if (setSelectedOption)
                                        setSelectedOption((prev) => ({
                                          ...prev,
                                          [item?.actualField ?? ""]: [],
                                        }));
                                    }}
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (setSelectedOption)
                                        setSelectedOption(multiSelect ?? {});
                                      (document.activeElement as HTMLElement)
                                        ?.blur();
                                    }}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                case "DATE":
                  return (
                    <div
                      key={item?.headerName}
                      className={filterClass}
                      style={filterStyle} // FIXED: Apply stable styling
                    >
                      <label className="responsiveLabel font-bold px-1">
                        {item?.headerName}
                      </label>
                      <div>
                        <RangePicker
                          ref={(node) => {
                            if (node && item?.actualField)
                              pickerRefs.current[item.actualField] = node as
                                | HTMLInputElement
                                | { focus?: () => void };
                          }}
                          className="custom-range-picker my-3"
                          format="MM-DD-YYYY"
                          value={
                            selectedDates?.[item?.actualField] as
                              | [Dayjs, Dayjs]
                              | null
                              | undefined
                          }
                          onChange={(
                            date:
                              | [Dayjs | null, Dayjs | null]
                              | null,
                            dateString: [string, string],
                          ) => {
                            const dates = date as Dayjs[] | null;
                            const dateStrings = dateString as string[];
                            if (!dates || dates.length === 0) {
                              handleFocusPicker(item?.actualField);
                            }
                            handleRangePicker(
                              dates,
                              dateStrings,
                              item?.actualField,
                            );
                          }}
                          allowClear={true}
                          disabledDate={(currentDate) =>
                            disabledDate(
                              currentDate,
                              (Array.isArray(
                                selectedDates?.[item?.actualField],
                              )
                                ? selectedDates?.[item?.actualField]
                                : []) as unknown[],
                              item?.actualField === "coder1DueDate" ||
                                item?.actualField == "coder2DueDate" ||
                                item?.actualField == "qaDueDate" ||
                                item?.actualField == "downloaderDueDate" ||
                                item?.actualField == "ownerDueDate" ||
                                item?.actualField == "projectEndDate",
                            )
                          }
                          inputReadOnly
                        />
                      </div>
                    </div>
                  );
                case "SEARCH_INT":
                  return (
                    <div
                      key={
                        (item as typeof item & { title?: string })?.title ??
                        item?.headerName
                      }
                      className={filterClass}
                      style={filterStyle} // FIXED: Apply stable styling
                    >
                      <label className="responsiveLabel">
                        {item?.headerName}
                      </label>
                      <ReusableIntegerInput
                        placeholder={`Search ${item?.headerName}`}
                        value={search ? search[item?.actualField] : ""}
                        isSearch={true}
                        setSearchText={(val: string | null) => {
                          markFilterOperation();
                          if (setSearch)
                            setSearch((prev) => ({
                              ...prev,
                              [item?.actualField]: val ?? "",
                            }));
                          if (setPageNo) setPageNo(1);
                        }}
                        setPageNumber={setPageNo ?? undefined}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          {/* Expand/Collapse button for filters */}
          {shouldShowExpandButton ? (
            <div className="col-12 mb-2">
              <Button
                type="link"
                onClick={toggleExpansion}
                style={{
                  padding: 0,
                  fontSize: "12px",
                  color: "#04306f",
                  fontWeight: "500",
                }}
                className="p-0"
              >
                {isExpanded
                  ? "Show Less"
                  : `See All Filters (${
                      activeFilterItems.length - filtersPerLine
                    } more)`}
              </Button>
            </div>
          ) : (
            <div className="mb-3"></div>
          )}
        </div>
      )}
    </>
  );
};

export default ReusableFilters;
