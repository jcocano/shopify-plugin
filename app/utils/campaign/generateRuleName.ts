export const generateRuleName = (existingRules: string[]) => {
  let counter = 1;
  let newRuleName = `Rule ${counter}`;
  while (existingRules.includes(newRuleName)) {
    counter++;
    newRuleName = `Rule ${counter}`;
  }
  return newRuleName;
};
