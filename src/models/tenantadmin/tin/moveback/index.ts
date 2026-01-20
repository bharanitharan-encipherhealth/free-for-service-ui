import { metaDataType } from "@/state/table/model";

export interface MovebackParamsType {
  activeFilters: metaDataType[];
  setActiveFilters: React.Dispatch<React.SetStateAction<metaDataType[] | []>>;
  triggerTableCustomization: Record<string, boolean>;
  setTriggerTableCustomization: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  onSelectionChange?: (hasSelection: boolean) => void;
  allocateModal: boolean;
  setAllocateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface moveBackModalType {
  openModal: boolean;
  setMoveBackModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface levelOptionResponseType {
  status: string;
  revertDescription: string;
}

export interface levelOptionType {
  status: string;
  message: string;
  response: levelOptionResponseType[];
}
