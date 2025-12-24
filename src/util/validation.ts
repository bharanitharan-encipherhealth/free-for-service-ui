export const CamelCase = (first: string, last?: string) => {
  if (last !== undefined) {
    return (
      first?.charAt(0).toUpperCase() +
      first?.slice(1).toLowerCase() +
      " " +
      last?.charAt(0).toUpperCase() +
      last?.slice(1).toLowerCase()
    );
  } else {
    return first?.charAt(0).toUpperCase() + first?.slice(1).toLowerCase();
  }
};

export const getTimeName = (hours: number) => {
  if (hours <= 11) return "Morning, ";
  else if (hours >= 12 && hours <= 16) return "Afternoon, ";
  else if (hours >= 18) return "Evening, ";
  else return "Hey, ";
};
