import {
  differenceInMinutes,
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isThisWeek,
} from "date-fns";

export const formatField = (field: string) => {
  if (field === "re_password") {
    return "Re-enter Password";
  }
  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to spaced
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
};

export const getValidationError = (
  field: string,
  value: string,
  currentPassword?: string
): string => {
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

export const getFormattedTime = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  const minutesAgo = differenceInMinutes(new Date(), date);

  if (minutesAgo < 1) {
    return "Just now";
  } else if (minutesAgo <= 5) {
    return formatDistanceToNow(date, { addSuffix: true }); // e.g. "5 minutes ago"
  } else if (isToday(date)) {
    return format(date, "p"); // e.g. "2:14 PM"
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "p")}`;
  } else if (isThisWeek(date)) {
    return `${format(date, "EEEE")} at ${format(date, "p")}`; // e.g. Wednesday at 2:14 PM
  } else {
    return format(date, "PP 'at' p");
  }
};
