import React from "react";

import Style from "./style.module.css";
import { CreateIdGens } from "@/util/reusableFunction";

const MeatButton = React.memo(
  ({
    select,
    setSelect,
    completed,
    id,
  }: {
    select: string;
    setSelect: React.Dispatch<React.SetStateAction<string>>;
    completed: string[];
    id: string;
  }) => {
    const list = ["M", "E", "A", "T"];

    return (
      <div className="flex my-2">
        <span
          className={`inline-block ${Style.containerBtnOld}`}
          id={
            id
              ? CreateIdGens("selectBtnGroup" + id)
              : CreateIdGens("selectBtnGroup")
          }
        >
          {list.map((i) => (
            <div
              key={i}
              className={`inline-block py-1 px-4 cursor-pointer ${
                completed?.includes(i)
                  ? `${Style.textColor} ${Style.bgFill} ${select == i && Style.successActive}`
                  : select == i
                    ? `${Style.btnColor}`
                    : ""
              }`}
              onClick={() => setSelect(i)}
              id={
                id
                  ? CreateIdGens(`selectBtn-${i}` + id)
                  : CreateIdGens(`selectBtn-${i}`)
              }
            >
              {i}
            </div>
          ))}
        </span>
      </div>
    );
  },
);

MeatButton.displayName = "MeatButton";

export default MeatButton;
