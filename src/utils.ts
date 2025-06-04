export const formatField = (field: string) => {
  return field
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
};

export const getValidationError = (field: string, value: string): string => {
  if (!value) return `${formatField(field)} is required`;

  if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
    return "Enter a valid email address";
  }

  return "";
};
