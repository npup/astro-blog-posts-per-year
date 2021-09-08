type MonthNameLong =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

/* Month number to human readable string */
export function getMonthName(mm: string | number): MonthNameLong {
  if ("number" === typeof mm) {
    mm = `0${mm}`.slice(-2);
  }
  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };
  return months[mm] || `[mm:${mm}]`;
}
