export const getPriorityValue = (priority: string | number | undefined) => {
  switch (priority) {
    case "Not defined":
      return 0;
    case "High":
      return 1;
    case "Medium":
      return 2;
    case "Low":
      return 3;
    default:
      return undefined;
  }
};

export const getPriorityString = (priority: number | undefined) => {
  if (priority !== undefined) {
    switch (priority) {
      case 0:
        return "Not defined";
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "";
    }
  }
};

export const endOfWeek = (date: {
  getDate: () => any;
  getDay: () => number;
  setDate: (arg0: number) => string | number | Date;
  toDateString: () => any;
}) => {
  const lastday = date.getDate() - (date.getDay() - 1) + 6;
  return new Date(date.setDate(lastday));
};


