export const formatField = (field: string) => {
  if (field === "re_password") {
    return "Re-enter Password";
  }
  return field
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
};

export const getValidationError = (
  field: string,
  value: string,
  currentPassword?: string
): string => {
  console.log({ field, value, currentPassword });
  if (!value) return `${formatField(field)} is required`;

  if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
    return "Enter a valid email address";
  } else if (field === "phone" && (value.length < 9 || value.length > 15)) {
    return "Phone number must be between 9 and 15 digits.";
  } else if (field === "re_password" && value !== currentPassword) {
    return "Passwords do not match.";
  }

  return "";
};
