import React from "react";
import Style from "./style.module.css";
import { useRouter } from "next/router";
import { createIdGen } from "../utils/reusable";

const RegularButton = ({
  type,
  name,
  onClick,
  width,
  method,
  loading,
  disabled,
  htmlType,
  id,
  padding,
  height,
}) => {
  const router = useRouter()
  return (
    <button
      id={
        id
          ? createIdGen("reusableBtn" + id)
          : createIdGen("reusableBtn" + router.pathname.replaceAll("/", " "))
      }
      className={`btn ${type === "outline" ? Style.outer : Style.btnColor
        }`}
      name={name}
      onClick={!htmlType && onClick}
      style={{ width: width, padding: padding, height: height }}
      type={
        method == "reset" ? "reset" : method == "button" ? "button" : "submit"
      }
      disabled={disabled}
      htmlType={htmlType}
    >
      {loading ? "LOADING..." : name}
    </button>
  );
};

export default RegularButton;

