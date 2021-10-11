export const fiscalYearGenerator = (startingYear) => {
  const startYear = startingYear || new Date().getFullYear();
  const endYear = new Date().getFullYear();
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