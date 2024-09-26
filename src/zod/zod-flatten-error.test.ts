import { z } from 'zod';
import { zodFlattenError } from './zod-flatten-error';

describe('zodFlatten', () => {
  describe('primitive', () => {
    test('not a string', () => {
      const result = z.string().safeParse(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(zodFlattenError(result.error)).toStrictEqual(
          'Expected string, received number',
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
          expect(zodFlattenError(result.error)).toStrictEqual(
            'Expected array, received number',
          );
        }
      });

      test('not a string on pos 0', () => {
        const result = z.array(z.string()).safeParse([1]);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodFlattenError(result.error)).toStrictEqual({
            '[0]': 'Expected string, received number',
          });
        }
      });

      test('not a string on pos 2', () => {
        const result = z.array(z.string()).safeParse(['', '', 1]);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodFlattenError(result.error)).toStrictEqual({
            '[2]': 'Expected string, received number',
          });
        }
      });

      test('not a string on pos 1 and 3', () => {
        const result = z.array(z.string()).safeParse(['', 1, '', true]);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodFlattenError(result.error)).toStrictEqual({
            '[1]': 'Expected string, received number',
            '[3]': 'Expected string, received boolean',
          });
        }
      });
    });

    describe('nested', () => {
      describe('array of primitives', () => {
        test('not an array', () => {
          const result = z.array(z.array(z.string())).safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual(
              'Expected array, received number',
            );
          }
        });

        test('not an array on pos 0', () => {
          const result = z.array(z.array(z.string())).safeParse([1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0]': 'Expected array, received number',
            });
          }
        });

        test('not an array on pos 2', () => {
          const result = z.array(z.array(z.string())).safeParse([[], [], 1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[2]': 'Expected array, received number',
            });
          }
        });

        test('not an array on pos 1 and 3', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([[], 1, [], true]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[1]': 'Expected array, received number',
              '[3]': 'Expected array, received boolean',
            });
          }
        });

        test('not a string on pos 0.0', () => {
          const result = z.array(z.array(z.string())).safeParse([[1]]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0][0]': 'Expected string, received number',
            });
          }
        });

        test('not a string on pos 0.2', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([['', '', 1], [], []]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0][2]': 'Expected string, received number',
            });
          }
        });

        test('not a string on pos 0.1 and 2.3', () => {
          const result = z
            .array(z.array(z.string()))
            .safeParse([['', 1, ''], [], ['', '', '', true]]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0][1]': 'Expected string, received number',
              '[2][3]': 'Expected string, received boolean',
            });
          }
        });
      });

      describe('object of primitives', () => {
        test('not an object', () => {
          const result = z.array(z.object({ 1: z.string() })).safeParse(1);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual(
              'Expected array, received number',
            );
          }
        });

        test('not an object on pos 0', () => {
          const result = z.array(z.object({ 1: z.string() })).safeParse([1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0]': 'Expected object, received number',
            });
          }
        });

        test('not an object on pos 2', () => {
          const result = z
            .array(z.object({ 1: z.string() }))
            .safeParse([{ 1: '' }, { 1: '' }, 1]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[2]': 'Expected object, received number',
            });
          }
        });

        test('not a string on pos 0 of 1 key', () => {
          const result = z
            .array(z.object({ 1: z.string() }))
            .safeParse([{ 1: 1 }]);

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              '[0].1': 'Expected string, received number',
            });
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
          expect(zodFlattenError(result.error)).toStrictEqual(
            'Expected object, received number',
          );
        }
      });

      test('not a string at 1 key', () => {
        const result = z.object({ 1: z.string() }).safeParse({ 1: 1 });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(zodFlattenError(result.error)).toStrictEqual({
            1: 'Expected string, received number',
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
            expect(zodFlattenError(result.error)).toStrictEqual(
              'Expected object, received number',
            );
          }
        });

        test('not an array on pos 0', () => {
          const result = z
            .object({ array: z.array(z.string()) })
            .safeParse({ array: 1 });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              array: 'Expected array, received number',
            });
          }
        });

        test('not a string on array key at pos 2', () => {
          const result = z
            .object({ array: z.array(z.string()) })
            .safeParse({ array: ['', '', 1] });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              'array[2]': 'Expected string, received number',
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
            expect(zodFlattenError(result.error)).toStrictEqual(
              'Expected object, received number',
            );
          }
        });

        test('not an object at primitives key', () => {
          const result = z
            .object({ primitives: z.object({ 1: z.string() }) })
            .safeParse({ primitives: 1 });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              primitives: 'Expected object, received number',
            });
          }
        });

        test('not a string at key.1 path', () => {
          const result = z
            .object({ primitives: z.object({ 1: z.string() }) })
            .safeParse({ primitives: { 1: 1 } });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(zodFlattenError(result.error)).toStrictEqual({
              'primitives.1': 'Expected string, received number',
            });
          }
        });
      });
    });
  });
});
