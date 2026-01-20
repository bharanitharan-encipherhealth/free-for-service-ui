import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import { inputType } from "@/models/reusableFilter";

const ReusableInput = ({
  setPageNumber,
  disabled,
  placeholder,
  value,
  isSearch,
  handleInputStr,
  setSearchText,
  props,
  testId,
  id,
  isMrnNumber = false,
  isIntAllow = false,
}: inputType) => {
  const [localStr, setLocalStr] = useState<string>("");
  const debounceFunc = useMemo(
    () =>
      debounce((text: string) => {
        setSearchText?.(text ? text.trim() : null);
        setPageNumber?.(0);
      }, 700),
    [setSearchText, setPageNumber]
  );

  const handleChange = (text: string) => {
    setLocalStr(text.trimStart());
    if (isSearch && !handleInputStr) {
      debounceFunc(text);
    }
    if (handleInputStr) {
      handleInputStr(text);
    }
  };

  useEffect(() => {
    setLocalStr(value?.trimStart() || "");
  }, [value]);
  return (
    <div id={id} className="reusableInput">
      <Input
        data-testid={testId}
        {...props}
        placeholder={placeholder}
        value={localStr}
        onChange={(e) => {
          if (e.target.value.startsWith(" ")) return;
          const newValue = e.target.value.trimStart();
          if (
            (isMrnNumber && !/^[0-9]*\/?[0-9]*$/.test(newValue)) ||
            (isIntAllow && !/^[A-Za-z ]*$/.test(newValue))
          )
            return;
          handleChange(newValue);
        }}
        prefix={<IoSearchOutline />}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        className={"w-100 reusableInput new-search border-none my-3"}
      />
    </div>
  );
};

export default ReusableInput;

export const debounce = <T extends (...args: string[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useSearchHandler = (
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  setPageNumber: React.Dispatch<React.SetStateAction<number>>
) => {
  const debouncedSearch = useMemo(
    () =>
      debounce((name: string) => {
        setSearchText(name);
        setPageNumber(0);
      }, 1000),
    [setSearchText, setPageNumber]
  );

  return debouncedSearch;
};
