import type { Schema, UnknownArray } from 'type-fest';
import type { z } from 'zod';

const isObject = (
  pathFragment: string | number | symbol,
): pathFragment is string => {
  return typeof pathFragment === 'string';
};

const isArray = (
  pathFragment: string | number | symbol,
): pathFragment is number => {
  return typeof pathFragment === 'number';
};

export const zodStructuredError = <T>(
  error: z.ZodError<T>,
): ZodStructuredError<T> => {
  if (error.issues[0].path.length === 0) {
    return error.issues[0].message as ZodStructuredError<T>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = typeof error.issues[0].path[0] === 'string' ? {} : [];
  error.issues.forEach((issue) => {
    let target = errors;
    issue.path.forEach((pathFragment, index, arr) => {
      const nextPathFragment = arr[index + 1];
      if (isObject(nextPathFragment)) {
        if (target[pathFragment] === undefined) {
          target[pathFragment] = {};
        }
        target = target[pathFragment];
        return;
      }
      if (isArray(nextPathFragment)) {
        if (target[pathFragment] === undefined) {
          target[pathFragment] = [];
        }
        target = target[pathFragment] as UnknownArray;
        return;
      }
      target[pathFragment] = issue.message;
    });
  });
  return errors as ZodStructuredError<T>;
};

export type ZodStructuredError<T> = Schema<T, string | undefined>;
