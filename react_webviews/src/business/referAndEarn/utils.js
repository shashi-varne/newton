import { differenceInHours, format, parse } from "date-fns";

export const getFnsFormattedDate = (
  dateStr,
  initialFormat = "yyyy-MM-dd",
  finalFormat = "dd MMM yy"
) => {
  let date = dateStr;

  try {
    if (initialFormat === "yyyy-MM-dd") {
      date = dateStr.substring(0, 10);
    }

    const dt = parse(date, initialFormat, new Date());
    date = format(dt, finalFormat);
  } catch (error) {
    date = dateStr;
  }

  return date;
};

export const getDiffInHours = (dateStr, initialFormat = "yyyy-MM-dd") => {
  let hours = "";
  try {
    const dt = parse(dateStr, initialFormat, new Date());
    hours = differenceInHours(dt, new Date());
  } catch (error) {
    hours = "";
  }

  return hours;
};

export const checkAllowedDecimalPoints = (value, allowedPoints = 2) => {
  let num = value.toString().split(".");
  if (num[1] && num[1].length > allowedPoints) {
    return false;
  }
  return true;
};
