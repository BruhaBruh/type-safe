import { Primitive, StringKeyOf, UnknownArray, UnknownRecord } from 'type-fest';
import { z } from 'zod';
import { ErrorMessage } from './error-message';

export const zodFlattenError = <T>(
  error: z.ZodError<T>,
): ZodFlattenError<T> => {
  if (error.issues[0].path.length === 0) {
    return error.issues[0].message as ZodFlattenError<T>;
  }

  const errors: UnknownRecord = {};
  error.issues.forEach((issue) => {
    const path: string[] = [];
    issue.path.forEach((pathFragment) => {
      const isKey = typeof pathFragment === 'string';
      if (path.length === 0) {
        path.push(isKey ? pathFragment : `[${pathFragment}]`);
        return;
      }
      path.push(isKey ? `.${pathFragment}` : `[${pathFragment}]`);
    });
    errors[path.join('')] = issue.message;
  });

  return errors as ZodFlattenError<T>;
};
export type ZodFlattenError<
  T,
  K extends string | null = null,
> = T extends Primitive
  ? K extends string
    ? Record<K, ErrorMessage>
    : ErrorMessage
  : T extends UnknownArray
    ? FlattenArrayError<T, K>
    : T extends UnknownRecord
      ? FlattenObjectError<T, K>
      : never;

type FlattenArrayError<T extends UnknownArray, K extends string | null> = {
  [key: number]: ErrorMessage;
} & ZodFlattenError<
  T[number],
  K extends string ? `${K}[${number}]` : `[${number}]`
>;

type FlattenObjectError<T extends UnknownRecord, K extends string | null> = {
  [key in keyof T]?: ErrorMessage;
} & ZodFlattenError<
  T[keyof T],
  K extends string ? `${K}.${StringKeyOf<T>}` : StringKeyOf<T>
>;
