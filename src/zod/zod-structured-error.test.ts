/* eslint-disable no-sparse-arrays */
import { z } from 'zod';
import { zodStructuredError } from './zod-structured-error';

describe('zodStructuredError', () => {
  describe('primitive', () => {
    test('not a string', () => {
      const result = z.string().safeParse(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(zodStructuredError(result.error)).toStrictEqual(
          'Invalid input: expected string, received number',
        );
      }
    });
  });

  describe('array', () => {
    describe('of primitives', () => {
      test('not an array', () => {
        const result = z.array(z.string()).safeParse(1);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodStructuredError(result.error)).toStrictEqual(
            'Invalid input: expected array, received number',
          );
        }
      });

      test('not a string on pos 0', () => {
        const result = z.array(z.string()).safeParse([1]);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodStructuredError(result.error)).toStrictEqual([
            'Invalid input: expected string, received number',
          ]);
        }
      });

      test('not a string on pos 2', () => {
        const result = z.array(z.string()).safeParse(['', '', 1]);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodStructuredError(result.error)).toStrictEqual([
            ,
            ,
            'Invalid input: expected string, received number',
          ]);
        }
      });

      test('not a string on pos 1 and 3', () => {
        const result = z.array(z.string()).safeParse(['', 1, '', true]);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = zodStructuredError(result.error);
          expect(error?.[1]).toStrictEqual(
            'Invalid input: expected string, received number',
          );
          expect(error?.[3]).toStrictEqual(
            'Invalid input: expected string, received boolean',
          );
        }
      });
    });

    describe('nested', () => {
      describe('array of primitives', () => {
        test('not an array', () => {
          const result = z.array(z.array(z.string())).safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual(
              'Invalid input: expected array, received number',
            );
          }
        });

        test('not an array on pos 0', () => {
          const result = z.array(z.array(z.string())).safeParse([1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              'Invalid input: expected array, received number',
            ]);
          }
        });

        test('not an array on pos 2', () => {
          const result = z.array(z.array(z.string())).safeParse([[], [], 1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              ,
              ,
              'Invalid input: expected array, received number',
            ]);
          }
        });

        test('not an array on pos 1 and 3', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([[], 1, [], true]);

          expect(result.success).toBe(false);
          if (!result.success) {
            const error = zodStructuredError(result.error);
            expect(error?.[1]).toStrictEqual(
              'Invalid input: expected array, received number',
            );
            expect(error?.[3]).toStrictEqual(
              'Invalid input: expected array, received boolean',
            );
          }
        });

        test('not a string on pos 0.0', () => {
          const result = z.array(z.array(z.string())).safeParse([[1]]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              ['Invalid input: expected string, received number'],
            ]);
          }
        });

        test('not a string on pos 0.2', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([['', '', 1], [], []]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              [, , 'Invalid input: expected string, received number'],
            ]);
          }
        });

        test('not a string on pos 0.1 and 2.3', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([['', 1, ''], [], ['', '', '', true]]);

          expect(result.success).toBe(false);
          if (!result.success) {
            const error = zodStructuredError(result.error);
            expect(error?.[0]?.[1]).toStrictEqual(
              'Invalid input: expected string, received number',
            );
            expect(error?.[2]?.[3]).toStrictEqual(
              'Invalid input: expected string, received boolean',
            );
          }
        });
      });

      describe('object of primitives', () => {
        test('not an object', () => {
          const result = z.array(z.object({ 1: z.string() })).safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual(
              'Invalid input: expected array, received number',
            );
          }
        });

        test('not an object on pos 0', () => {
          const result = z.array(z.object({ 1: z.string() })).safeParse([1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              'Invalid input: expected object, received number',
            ]);
          }
        });

        test('not an object on pos 2', () => {
          const result = z
            .array(z.object({ 1: z.string() }))
            .safeParse([{ 1: '' }, { 1: '' }, 1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              ,
              ,
              'Invalid input: expected object, received number',
            ]);
          }
        });

        test('not a string on pos 0 of 1 key', () => {
          const result = z
            .array(z.object({ 1: z.string() }))
            .safeParse([{ 1: 1 }]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual([
              { 1: 'Invalid input: expected string, received number' },
            ]);
          }
        });
      });
    });
  });

  describe('object', () => {
    describe('of primitives', () => {
      test('not an object', () => {
        const result = z.object({ 1: z.string() }).safeParse(1);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodStructuredError(result.error)).toStrictEqual(
            'Invalid input: expected object, received number',
          );
        }
      });

      test('not a string at 1 key', () => {
        const result = z.object({ 1: z.string() }).safeParse({ 1: 1 });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodStructuredError(result.error)).toStrictEqual({
            1: 'Invalid input: expected string, received number',
          });
        }
      });
    });

    describe('nested', () => {
      describe('array of primitives', () => {
        test('not an array', () => {
          const result = z.object({ array: z.array(z.string()) }).safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual(
              'Invalid input: expected object, received number',
            );
          }
        });

        test('not an array on pos 0', () => {
          const result = z
            .object({ array: z.array(z.string()) })
            .safeParse({ array: 1 });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual({
              array: 'Invalid input: expected array, received number',
            });
          }
        });

        test('not a string on array key at pos 2', () => {
          const result = z
            .object({ array: z.array(z.string()) })
            .safeParse({ array: ['', '', 1] });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual({
              array: [, , 'Invalid input: expected string, received number'],
            });
          }
        });
      });

      describe('object of primitives', () => {
        test('not an object', () => {
          const result = z
            .object({ primitives: z.object({ 1: z.string() }) })
            .safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual(
              'Invalid input: expected object, received number',
            );
          }
        });

        test('not an object at primitives key', () => {
          const result = z
            .object({ primitives: z.object({ 1: z.string() }) })
            .safeParse({ primitives: 1 });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual({
              primitives: 'Invalid input: expected object, received number',
            });
          }
        });

        test('not a string at key.1 path', () => {
          const result = z
            .object({ primitives: z.object({ 1: z.string() }) })
            .safeParse({ primitives: { 1: 1 } });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodStructuredError(result.error)).toStrictEqual({
              primitives: {
                1: 'Invalid input: expected string, received number',
              },
            });
          }
        });
      });
    });
  });
});
