export const fiscalYearGenerator = (startingYear) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = startingYear || currentYear;
  // Current year can be considered for endYear, if we have crossed March (i.e) new financial year with current year has started
  const endYear = currentMonth > 2 ? currentYear : currentYear - 1;
  const fiscalYearCount = endYear - startYear + 1;

  if (!fiscalYearCount) return [];
  
  const fiscalYearArr = [];
  for (let i = 0; i < fiscalYearCount; i++) {
    const [start, end] = [startYear + i, startYear + i + 1];
    fiscalYearArr.push({
      name: `${start}-${(end).toString().slice(2)}`,
      value: `${start}-${end}`
    });
  }
  return fiscalYearArr;
}