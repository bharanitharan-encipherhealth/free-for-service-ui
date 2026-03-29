import React, { useEffect, useRef, useState } from "react";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, InputRef, Select, Space } from "antd";
import { getResponePopup } from "@/util/reusableFunction";
import { customSelectType } from "@/state/reusableTypes";
import { DefaultOptionType } from "antd/es/select";

const CustomSelect = React.memo(
  ({
    options,
    onChange,
    setOptions,
    value,
    disabled,
    placeholder,
    size,
  }: customSelectType) => {
    //   const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trimStart();
      setName(value);
    };

    const handleDeleteCommnet = ({ comment }: { comment: string }) => {
      setOptions((prev) =>
        prev.filter((item: DefaultOptionType) => item?.value != comment),
      );
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      if (comment == value) onChange("");
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const trimmedName = name?.trim();
      if (!trimmedName) return;
      if (/^[^a-zA-Z0-9]/.test(trimmedName)) {
        getResponePopup({
          status: "FAILED",
          message: "First character cannot be a special character",
          duration: 5,
        });
        return;
      }

      const isDuplicate = options.some(
        (option) =>
          String(option?.value)?.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (isDuplicate) {
        getResponePopup({
          status: "FAILED",
          message: "Item already exists!",
          duration: 5,
        });
        return;
      }

      setOptions([
        ...options,
        { label: trimmedName, value: trimmedName, isNewAdd: true },
      ]);
      setName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    return (
      <Select
        className="w-full capitalize"
        disabled={disabled}
        size={size || "large"}
        placeholder={placeholder ? placeholder : ""}
        allowClear
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <div
              style={{ padding: "0 8px 4px", width: "100%" }}
              className="flex"
            >
              <Input
                placeholder="Please enter item"
                value={name}
                onChange={onNameChange}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{ width: "70%" }}
              />
              <Button
                type="text"
                size="large"
                style={{
                  backgroundColor: "black",
                  margin: "0 10px",
                  color: "#fff",
                }}
                icon={<PlusOutlined twoToneColor="#fff" />}
                onClick={addItem}
              >
                Add item
              </Button>
            </div>
          </>
        )}
        options={options}
        onChange={onChange}
        value={value}
        optionRender={(option) => (
          <div className="flex items-center" style={{ cursor: "pointer" }}>
            <div
              className="grow text-runcate"
              title={String(option?.label ?? "")}
            >
              {option?.label}
            </div>

            {option.data?.isNewAdd && (
              <div
                className="ms-2 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCommnet({ comment: String(option?.value ?? "") });
                }}
              >
                <CloseCircleOutlined />
              </div>
            )}
          </div>
        )}
      />
    );
  },
);

CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
