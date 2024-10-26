export const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
