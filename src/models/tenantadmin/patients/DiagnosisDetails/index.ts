import { DiseaseItem, Hyperlink, MeatCriteriaItem } from "../details";

export interface isFilterOpenType {
  filter: boolean;
  notes: boolean;
  comments: boolean;
  versionhistory: boolean;
  timeline: boolean;
}
export interface DiagnosisDetailsPropsType {
  collapse: string[];
  setCollapse: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFilterOpen?: React.Dispatch<React.SetStateAction<isFilterOpenType>>;
  activeTab: number;
}

export interface FilterPropstype {
  handleCloseModal: () => void;
}

export interface FileLayoutType extends DiagnosisDetailsPropsType {
  diseaseCategories: {
    id: number;
    cardTitle: string;
    children: React.ReactNode;
    length: number;
    layout: string;
  }[];
}

export interface HccCardType {
  diseaseData: DiseaseItem[];
  cardTitle: string;
}

export interface showMoveIconType {
  diagnosisIcon: boolean;
  careGapIcon: boolean;
  potientialIcon: boolean;
  deleteIcon: boolean;
}
export interface MovementIconType {
  showMoveIcon: showMoveIconType;
}

export interface renderProviderSectionType {
  setPdfSearch?: (params: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  }) => void;
  capture: string[];
  hyperLinks?: Hyperlink[];
  pdfSearchValue?: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
  hyperlinkKey: keyof Hyperlink;
  isDateShow?: boolean;
  sectionName: "providerSection" | "dateSection" | "captureSection";
}

export interface DiseaseTagType {
  data: DiseaseItem;
}

export interface MeatSectionType {
  meatDetails: DiseaseItem;
}

export interface generateMeatCriteriaListType<T> {
  meatList: T[];
}

export interface renderMeatFoundType {
  meatList: MeatCriteriaItem[];
  code: string;
  value: string;
}

export type FilterKey =
  | "filter"
  | "timeline"
  | "comments"
  | "notes"
  | "versionhistory";

export interface FilterPropsType {
  setIsFilterOpen: React.Dispatch<
    React.SetStateAction<Record<FilterKey, boolean>>
  >;
}

export interface commentsResponseType {
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
  version: number | null;

  createdBy: string;
  lastModifiedBy: string;

  commentId: string;
  userComment: string;

  createdByDetails: {
    firstName: string;
    lastName: string;
    userName: string;
    profileImageUrl: string | null;
    role: string | null;
  };

  processedYear: number;
  dateOfService: string;
}

export interface commentsType {
  status: string;
  message: string;
  response: commentsResponseType[];
}

export interface notesResponseType extends commentsResponseType {
  note: string;
  noteId: string;
}

export interface notesType {
  status: string;
  message: string;
  response: notesResponseType[];
}

export interface MeatRowType {
  meatCreteriaList: MeatCriteriaItem[];
  meatCreteria: "meat" | "delete";
}

export interface meatHyperLinkType {
  hyperlinks: Hyperlink[];
  setPdfSearch: (params: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  }) => void;
  pdfSearchValue: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
  title: string;
  aspectValue: string;
}
