export type PrimitiveType =
  | null
  | undefined
  | number
  | string
  | Symbol
  | boolean;

/**
 * Check if a variable is undefined or null.
 */
export function isNil(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

/**
 * Check if a variable is an object like.
 */
export function isObjectLike<TObject extends object>(
  value: unknown
): value is TObject {
  return value != null && typeof value === "object";
}

/**
 * Check if an object is a function
 */
export const isFunction = (obj: unknown): obj is Function =>
  !!obj && typeof obj === "function";

/**
 * Returns true if the value acts like a Promise, i.e. has a "then" function,
 * otherwise returns false.
 */
export const isPromise = (value: any): value is Promise<unknown> =>
  isFunction(value?.then);

/**
 * Check if a variable is primitive.
 */
export const isPrimitive = (value: unknown): value is PrimitiveType =>
  value !== Object(value);

/**
 * Check if a variable is a string.
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string" ||
  (!Array.isArray(value) &&
    isObjectLike(value) &&
    value.toString?.() === "[object String]");

/**
 * Check if a variable is a string.
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/**
 * Check if a variable is a boolean
 *
 * @param value
 * @returns
 */
export const isBoolean = (value: unknown): boolean =>
  value === false || value === true;

/**
 * Convert boolean strings to boolean value
 */
export const stringToBool = (value: string) => {
  switch (value.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return value;
  }
};

export const isEmpty = (value: string | object) =>
  (typeof value === "string" && value.trim().length === 0) ||
  (value === "object" && value.length === 0);
