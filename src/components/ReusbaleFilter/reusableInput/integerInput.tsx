import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import { inputType } from "@/models/reusableFilter";

const ReusableIntegerInput = ({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    const allowedNumber = /^[1-9]\d*$/;
    if (text !== "" && !allowedNumber.test(text)) return;
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
        onChange={handleChange}
        prefix={<IoSearchOutline />}
        allowClear={true}
        disabled={disabled}
        autoComplete="off"
        className="w-100 reusableInput new-search border-none"
      />
    </div>
  );
};

export default ReusableIntegerInput;

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
