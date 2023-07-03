//get first name from full name

export const getFirstName = (fullName: string | null): string => {
  if (!fullName) {
    return '';
  }
  return fullName.split(' ')[0];
};
