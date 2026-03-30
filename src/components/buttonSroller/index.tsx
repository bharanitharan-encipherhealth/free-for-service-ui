import React from "react";
import styles from "./styles.module.css";

interface ButtonItem {
  id?: number | string;
  title: string;
  value?: string;
}

interface ButtonscrollerProps {
  Buttons: ButtonItem[];
  activeButton: number;
  handleButtonClick: (index: number, title: string) => void;
  activeColor?: string;
  inActiveColor?: string;
  activeBg?: string;
  inActiveBg?: string;
  containerBg?: string;
  width?: string | boolean;
  id?: string;
  name?: string;
}

const Buttonscroller: React.FC<ButtonscrollerProps> = ({
  Buttons,
  activeButton,
  handleButtonClick,
  activeColor,
  inActiveColor,
  activeBg,
  inActiveBg,
  containerBg,
  width,
  id = "default-btn",
  name = "default-btn",
}) => {
  return (
    <div
      id={id}
      className={styles.btnContainer}
      style={{
        backgroundColor: containerBg,
      }}
    >
      {Buttons?.map((btn, index) => {
        return (
          <label
            id={btn?.title}
            key={index}
            className={`${activeButton === index ? styles.btnActive : styles.btnInactive
              }`}
            style={{
              backgroundColor: activeButton === index ? activeBg : inActiveBg,
              color: activeButton === index ? activeColor : inActiveColor,
              borderRadius: activeButton === index ? "16px" : undefined,
              width: width ? "150px" : undefined,
            }}
            onClick={() => handleButtonClick(index, btn?.title)}
          >
            {btn.title}
          </label>
        );
      })}
    </div>
  );
};

export default Buttonscroller;
