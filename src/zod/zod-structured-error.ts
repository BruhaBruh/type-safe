import { Primitive, UnknownArray, UnknownRecord } from 'type-fest';
import { z } from 'zod';
import { ErrorMessage } from './error-message';

const isObject = (pathFragment: string | number): pathFragment is string => {
  return typeof pathFragment === 'string';
};

const isArray = (pathFragment: string | number): pathFragment is number => {
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
        if (target[pathFragment] === undefined) target[pathFragment] = {};
        target = target[pathFragment];
        return;
      }
      if (isArray(nextPathFragment)) {
        if (target[pathFragment] === undefined) target[pathFragment] = [];
        target = target[pathFragment] as UnknownArray;
        return;
      }
      target[pathFragment] = issue.message;
    });
  });
  return errors as ZodStructuredError<T>;
};

export type ZodStructuredError<T> = T extends Primitive
  ? ErrorMessage
  : T extends UnknownArray
    ? StructuredArrayError<T>
    : T extends UnknownRecord
      ? StructuredObjectError<T>
      : never;

type StructuredArrayError<T extends UnknownArray> =
  | ErrorMessage
  | (ErrorMessage | ZodStructuredError<T[number]>)[];

type StructuredObjectError<T extends UnknownRecord> =
  | ErrorMessage
  | {
      [key in keyof T]?: ZodStructuredError<T[key]>;
    };
