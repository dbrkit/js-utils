import { resolveValue, tokenizePath } from "path-value";

import { isObjectLike, isPrimitive } from "./type";

/**
 * Get an array of object keys with dot notation
 */
export const getKeys = (obj: object): string[] => {
  const keys: string[] = [];

  const walk = (o: any, parent: string | null = null) => {
    for (const k of Object.keys(o)) {
      const current = parent ? `${parent}.${k}` : k;

      // TODO: getKeys doesn't loop through arrays
      if (!Array.isArray(o[k]) && isObjectLike(o[k])) walk(o[k], current);
      else keys.push(current);
    }
  };

  walk(obj);

  return keys;
};

/**
 * Get key of path (dot notation)
 */
export const getKeyPath = (path: string): Array<string> =>
  Array.isArray(path) ? path : path.split(".");

/**
 * Get property value from an object or an array using dot notation
 */
export const getValue = (
  object: object,
  path: string,
  defaultValue: any = undefined
): any => {
  try {
    const pathArray = tokenizePath(path);
    return resolveValue(object, pathArray);
  } catch {
    return defaultValue;
  }
};

/**
 * Set value on object using dot notation
 */
export const setValue = (object: object, path: string, value: any) =>
  getKeyPath(path).reduceRight(
    (v, k, i, ks) => ({
      ...(getValue(object, ks.slice(0, i).join(".")) ?? object),
      [k]: v,
    }),
    value
  );

/**
 * Remove the specified values from object, recursively
 */
export function removeTypes<T>(
  obj: T & (object | ArrayLike<unknown>),
  defaults: Array<undefined | null | string | never[]> = [
    undefined,
    null,
    "",
    [],
  ]
): Partial<T> | {} | null | undefined {
  if (!defaults.length) return obj;
  if (typeof obj === "string" && defaults.includes(obj)) return undefined;

  if (Array.isArray(obj)) {
    if (obj.length)
      return obj
        .map((v) => (v && typeof v === "object" ? removeTypes(v, defaults) : v))
        .filter((v) => !defaults.includes(v));
    return obj;
  }

  return Object.entries(obj).length
    ? Object.entries(obj)
        .map(([k, v]) => [
          k,
          v && typeof v === "object" ? removeTypes(v, defaults) : v,
        ])
        .reduce(
          (a, [k, v]) =>
            defaults.includes(v) ||
            (v &&
              !Object.keys(v).length &&
              Object.getPrototypeOf(v) === Object.prototype)
              ? a
              : { ...a, [k]: v },
          {}
        )
    : obj;
}

/**
 * Replace the specified values from object with matched values, using initial values.
 */
export const replaceWithNullValues = <
  T extends { [x: string]: any } = { [x: string]: any }
>(
  values: T,
  initialValues: {
    [x: string]: any;
  },
  matchValue: undefined | string | number = ""
): T =>
  Object.assign(
    {},
    ...Array.from(
      new Set([...Object.keys(values), ...Object.keys(initialValues)]),
      (k) => ({
        [k]:
          //  eslint-disable-next-line no-nested-ternary
          !Array.isArray(values[k]) &&
          isObjectLike(values[k]) &&
          isObjectLike(initialValues[k])
            ? replaceWithNullValues(values[k], initialValues[k])
            : (values[k] === matchValue &&
                initialValues[k] &&
                initialValues[k] !== values[k]) ||
              (Array.isArray(values[k]) &&
                Array.isArray(initialValues[k]) &&
                values[k].length !== initialValues[k].length)
            ? null
            : values[k],
      })
    )
  );

/**
 * Substitute all object values that correspond to the first parameter with the second one, recursively
 */
export const setProps = (
  obj: any,
  replace: string,
  val: null | undefined | string
) => {
  const object = Array.isArray(obj) ? obj : Object.keys(obj);
  object.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "object" && !(obj[key] instanceof Array)) {
        setProps(obj[key], replace, val);
        return;
      }
      if (obj[key] === replace)
        // eslint-disable-next-line no-param-reassign
        obj[key] = val;
    }
  });
};

/**
 * Merge values of the leftObject with the rightObject.
 * This method returns a new Object.
 */
export function mergeLeft<T, TT>(
  leftObject: Partial<T>,
  rightObject: Partial<TT>,
  defaultValue: any = "",
  overrideValues: (string | null)[] = [null]
): Partial<T & TT> {
  let res = {};
  for (const k of getKeys(leftObject)) {
    const rightValue = getValue(rightObject, k, undefined);
    if (rightValue === undefined || overrideValues.includes(rightValue)) {
      const leftValue = getValue(leftObject, k, defaultValue);
      res = setValue(res, k, leftValue);
    } else {
      res = setValue(res, k, rightValue);
    }
  }
  return res;
}

/**
 * Tests if two objects, and their child objects, are equal.
 */
export const deepEquals = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;

  if (isPrimitive(obj1) && isPrimitive(obj2)) return obj1 === obj2;

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (!(key in obj2)) return false;
      if (!deepEquals(obj1[key], obj2[key])) return false;
    }
  }

  return true;
};

export const checkDiff = (obj: any, obj2: any) => {
  return Object.keys(obj2).some((k) => {
    // eslint-disable-next-line eqeqeq
    return obj2[k] != obj[k];
  });
};

export function mergeRefs<T>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export function depsAreEqual(
  prevDeps: React.DependencyList,
  deps: React.DependencyList
): boolean {
  return (
    prevDeps.length === deps.length &&
    deps.every((dep, index) => Object.is(dep, prevDeps[index]))
  );
}
