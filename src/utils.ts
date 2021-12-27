export const isFunction = (arg: unknown): arg is (...args: any[]) => any =>
  typeof arg === 'function';

export const isBoolean = (arg: unknown): arg is boolean => {
  return typeof arg === 'boolean';
};

export const isObject = (arg: unknown): arg is boolean => {
  return typeof arg === 'object';
};

export const isNotFalse = (arg: unknown): arg is boolean => {
  return !(isBoolean(arg) && !arg);
};

export const isRegExp = (arg: unknown): arg is RegExp =>
  Object.prototype.toString.call(arg) === '[object RegExp]';
