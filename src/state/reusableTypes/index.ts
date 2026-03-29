import { SizeType } from "antd/es/config-provider/SizeContext";
import { DefaultOptionType } from "antd/es/select";

export interface customSelectType {
  options: optionsTypes[];
  onChange: (a: string) => void;
  setOptions: React.Dispatch<React.SetStateAction<optionsTypes[]>>;
  value?: string;
  disabled?: boolean;
  placeholder: string;
  size?: SizeType;
}

export type optionsTypes = { label: string; value: string; isNewAdd?: boolean };
