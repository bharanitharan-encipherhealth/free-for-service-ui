import React from "react";

interface Button {
  title: string;
}

interface ButtonscrollerProps {
  Buttons: Button[];
  activeButton: number;
  handleButtonClick: (index: number, title: string) => void;
  activeColor?: string;
  inActiveColor?: string;
  activeBg?: string;
  inActiveBg?: string;
  containerBg?: string;
  width?: string;
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
      className="flex items-center rounded-[16px] h-[35px]"
      style={{
        backgroundColor: containerBg,
      }}
    >
      {Buttons?.map((btn, index) => {
        const isActive = activeButton === index;
        return (
          <label
            id={btn?.title}
            key={index}
            className={`flex items-center justify-center m-0 cursor-pointer h-full text-center px-4 ${
              isActive ? "rounded-[16px]" : "rounded-[16px] text-[#9291a5]"
            } ${width ? "w-[150px]" : "w-[94px] xl:w-[100px]"}`}
            style={{
              backgroundColor: isActive ? activeBg : inActiveBg,
              color: isActive ? activeColor : inActiveColor,
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
