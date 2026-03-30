import React from "react";
import Style from "./style.module.css";
import { useRouter } from "next/navigation";
import { RegularButtonType } from "@/models/components/regularButton";
// import { createIdGen } from "../../utils/reusable";

const RegularButton = ({
  type,
  name,
  onClick,
  width,
  method,
  loading,
  disabled,
  htmlType,
  padding,
  height,
}: RegularButtonType) => {
  return (
    <button
      // id={
      //   id
      //     ? createIdGen("reusableBtn" + id)
      //     : createIdGen("reusableBtn" + router.pathname.replaceAll("/", " "))
      // }
      className={`btn ${type === "outline" ? Style.outer : Style.btnColor} ${
        disabled && Style.disabledBtn
      }`}
      name={name}
      onClick={!htmlType ? onClick : undefined}
      style={{ width: width, padding: padding, height: height }}
      type={
        method == "reset" ? "reset" : method == "button" ? "button" : "submit"
      }
      disabled={disabled}
    >
      {loading ? "LOADING..." : name}
    </button>
  );
};

export default RegularButton;
