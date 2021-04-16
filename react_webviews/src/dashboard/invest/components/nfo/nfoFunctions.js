export function getFormattedStartDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1];
    });
  }
}

export function getFormattedEndDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1] + " " + p3;
    });
  }
}

export function getSchemeOption(text) {
  if (!text) {
    return null;
  } else {
    return text.split("_").join(" ");
  }
}
