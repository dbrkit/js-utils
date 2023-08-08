export const pluralize = (single: string, plural?: string, length?: number) => {
  return !!length ? (length > 1 && plural ? plural : single) : single;
};
