export const getInitialDate = (startDate: string) => ({
  month: new Date(startDate).getMonth(),
  year: new Date(startDate).getFullYear(),
});

export const createHandleMonthChange = (setDate: (date: { month: number; year: number }) => void) => 
  (month: number, year: number) => {
    setDate({ month, year });
};
