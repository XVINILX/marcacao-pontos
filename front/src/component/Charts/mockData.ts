export const generateMockData = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const data = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const hours = Math.floor(Math.random() * 10); // Random hours between 0 and 10
    data.push({ date, hours });
  }

  return data;
};
