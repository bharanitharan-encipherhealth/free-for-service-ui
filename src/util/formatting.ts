// only accepting letter, number and empty space
export const removeSpecialChars = (value: string) => {
  if (value && value.length > 0) return value.replace(/[^A-Za-z0-9_ ]/g, "");
  return "";
};

export const numbersCommaSeparators = (value: number ) => {
  if (value) {
     return value.toLocaleString('en-US');
  } else {
    return value
  }
}

export const exactData = (val: string | number | Date ) => {  
    const date = new Date(val);
    return date.toLocaleString();
  };