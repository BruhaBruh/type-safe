import { AsyncResult } from './async-result';
import type { Result } from './result';
import { Err, Ok } from './result';

describe('Result', () => {
  const testCases: {
    value: unknown;
    result: Result<unknown, unknown>;
    name: string;
    isOk: boolean;
  }[] = [
    {
      value: 1,
      result: Ok(1),
      name: 'Ok(1)',
      isOk: true,
    },
    {
      value: 1,
      result: Err(1),
      name: 'Err(1)',
      isOk: false,
    },
    {
      value: 'raw',
      result: Ok('raw'),
      name: 'Ok("raw")',
      isOk: true,
    },
    {
      value: 'raw',
      result: Err('raw'),
      name: 'Err("raw")',
      isOk: false,
    },
    {
      value: 'go',
      result: Ok('go'),
      name: 'Ok("go")',
      isOk: true,
    },
    {
      value: 'go',
      result: Err('go'),
      name: 'Err("go")',
      isOk: false,
    },
    {
      value: true,
      result: Ok(true),
      name: 'Ok(true)',
      isOk: true,
    },
    {
      value: true,
      result: Err(true),
      name: 'Err(true)',
      isOk: false,
    },
    {
      value: false,
      result: Ok(false),
      name: 'Ok(false)',
      isOk: true,
    },
    {
      value: false,
      result: Err(false),
      name: 'Err(false)',
      isOk: false,
    },
    {
      value: null,
      result: Ok(null),
      name: 'Ok(null)',
      isOk: true,
    },
    {
      value: null,
      result: Err(null),
      name: 'Err(null)',
      isOk: false,
    },
    {
      value: undefined,
      result: Ok(undefined),
      name: 'Ok(undefined)',
      isOk: true,
    },
    {
      value: undefined,
      result: Err(undefined),
      name: 'Err(undefined)',
      isOk: false,
    },
    {
      value: NaN,
      result: Ok(NaN),
      name: 'Ok(NaN)',
      isOk: true,
    },
    {
      value: NaN,
      result: Err(NaN),
      name: 'Err(NaN)',
      isOk: false,
    },
    {
      value: { test: true },
      result: Ok({ test: true }),
      name: 'Ok({"test":true})',
      isOk: true,
    },
    {
      value: { test: true },
      result: Err({ test: true }),
      name: 'Err({"test":true})',
      isOk: false,
    },
  ];

  describe('isOk', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be ${isOk}`, () => {
          expect(result.isOk()).toStrictEqual(isOk);
        });
      });
    });
  });

  describe('isOkAnd', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be ${isOk}: truthy fn`, () => {
          expect(result.isOkAnd(() => true)).toStrictEqual(isOk);
        });

        test(`should be false: falsy fn`, () => {
          expect(result.isOkAnd(() => false)).toStrictEqual(false);
        });
      });
    });
  });

  describe('isErr', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be ${!isOk}`, () => {
          expect(result.isErr()).toStrictEqual(!isOk);
        });
      });
    });
  });

  describe('isErrAnd', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be ${!isOk}: truthy fn`, () => {
          expect(result.isErrAnd(() => true)).toStrictEqual(!isOk);
        });

        test(`should be false: falsy fn`, () => {
          expect(result.isErrAnd(() => false)).toStrictEqual(false);
        });
      });
    });
  });

  describe('and', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = Ok(100);
        const err = Err(0);

        test(`should be ${isOk ? ok : result}: ${ok}`, () => {
          const res = result.and(ok);
          expect(res.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(100);
          } else {
            expect(res.unwrapErr()).toStrictEqual(result.unwrapErr());
          }
        });

        test(`should be ${isOk ? err : result}: ${err}`, () => {
          const res = result.and(err);
          expect(res.isErr()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrapErr()).toStrictEqual(0);
          } else {
            expect(res.unwrapErr()).toStrictEqual(result.unwrapErr());
          }
        });
      });
    });
  });

  describe('andThen', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = Ok(100);
        const err = Err(0);

        test(`should be ${isOk ? ok : result}: ${ok}`, () => {
          const res = result.andThen(() => ok);
          expect(res.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(100);
          } else {
            expect(res.unwrapErr()).toStrictEqual(result.unwrapErr());
          }
        });

        test(`should be ${isOk ? err : result}: ${err}`, () => {
          const res = result.andThen(() => err);
          expect(res.isErr()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrapErr()).toStrictEqual(0);
          } else {
            expect(res.unwrapErr()).toStrictEqual(result.unwrapErr());
          }
        });
      });
    });
  });

  describe('or', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = Ok(100);
        const err = Err(0);

        test(`should be ${isOk ? result : ok}: ${ok}`, () => {
          const res = result.or(ok);
          expect(res.isOk()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(isOk ? result.unwrap() : 100);
          }
        });

        test(`should be ${isOk ? result : err}: ${err}`, () => {
          const res = result.or(err);
          expect(res.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(result.unwrap());
          } else {
            expect(res.unwrapErr()).toStrictEqual(0);
          }
        });
      });
    });
  });

  describe('orElse', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = Ok(100);
        const err = Err(0);

        test(`should be ${isOk ? result : ok}: ${ok}`, () => {
          const res = result.orElse(() => ok);
          expect(res.isOk()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(isOk ? result.unwrap() : 100);
          }
        });

        test(`should be ${isOk ? result : err}: ${err}`, () => {
          const res = result.orElse(() => err);
          expect(res.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(result.unwrap());
          } else {
            expect(res.unwrapErr()).toStrictEqual(0);
          }
        });
      });
    });
  });

  describe('map', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = 100;

        test(`should be ${isOk ? ok : result}: ${ok}`, () => {
          const mapped = result.map(() => ok);
          expect(mapped.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(mapped.unwrap()).toStrictEqual(ok);
          }
        });
      });
    });
  });

  describe('mapOr', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = 100;
        const defaultOk = 1000;
        test(`should be ${isOk ? ok : defaultOk}: ${defaultOk} ${ok}`, () => {
          const mapped = result.mapOr(defaultOk, () => ok);
          if (isOk) {
            expect(mapped).toStrictEqual(ok);
          } else {
            expect(mapped).toStrictEqual(defaultOk);
          }
        });
      });
    });
  });

  describe('mapOrElse', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = 100;
        const defaultOk = 1000;
        test(`should be ${isOk ? ok : defaultOk}: ${defaultOk} ${ok}`, () => {
          const mapped = result.mapOrElse(
            () => defaultOk,
            () => ok,
          );
          if (isOk) {
            expect(mapped).toStrictEqual(ok);
          } else {
            expect(mapped).toStrictEqual(defaultOk);
          }
        });
      });
    });
  });

  describe('mapErr', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const err = 100;

        test(`should be ${isOk ? result : err}: ${err}`, () => {
          const mapped = result.mapErr(() => err);
          expect(mapped.isOk()).toStrictEqual(isOk);
          if (!isOk) {
            expect(mapped.unwrapErr()).toStrictEqual(err);
          }
        });
      });
    });
  });

  describe('expect', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        const msg = 'Some Error';
        test(`should ${isOk ? `be ${value}` : `throw "${msg}"`}: "${msg}"`, () => {
          if (isOk) {
            const v = result.expect(msg);
            expect(v).toStrictEqual(value);
          } else {
            expect(() => result.expect(msg)).toThrowError(msg);
          }
        });
      });
    });
  });

  describe('expectErr', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        const msg = 'Some Error';
        test(`should ${isOk ? `throw "${msg}"` : `be ${value}`}: "${msg}"`, () => {
          if (isOk) {
            expect(() => result.expectErr(msg)).toThrowError(msg);
          } else {
            const v = result.expectErr(msg);
            expect(v).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('inspect', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be called ${isOk ? 1 : 0} time(s)`, () => {
          const fn = vi.fn();
          result.inspect(fn);
          expect(fn).toBeCalledTimes(isOk ? 1 : 0);
        });
      });
    });
  });

  describe('inspectErr', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        test(`should be called ${isOk ? 0 : 1} time(s)`, () => {
          const fn = vi.fn();
          result.inspectErr(fn);
          expect(fn).toBeCalledTimes(isOk ? 0 : 1);
        });
      });
    });
  });

  describe('unwrap', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should ${isOk ? `be ${value}` : `throw "Tried to unwrap Err"`}`, () => {
          if (isOk) {
            const v = result.unwrap();
            expect(v).toStrictEqual(value);
          } else {
            expect(() => result.unwrap()).toThrowError('Tried to unwrap Err');
          }
        });
      });
    });
  });

  describe('unwrapErr', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should ${isOk ? `throw "Tried to unwrap Ok"` : `be ${value}`}`, () => {
          if (isOk) {
            expect(() => result.unwrapErr()).toThrowError('Tried to unwrap Ok');
          } else {
            const v = result.unwrapErr();
            expect(v).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('unwrapOr', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        const defaultValue = 100;
        test(`should be ${isOk ? value : defaultValue}: ${defaultValue}`, () => {
          const v = result.unwrapOr(defaultValue);
          expect(v).toStrictEqual(isOk ? value : defaultValue);
        });
      });
    });
  });

  describe('unwrapOrElse', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        const defaultValue = 100;
        test(`should be ${isOk ? value : defaultValue}: ${defaultValue}`, () => {
          const v = result.unwrapOrElse(() => defaultValue);
          expect(v).toStrictEqual(isOk ? value : defaultValue);
        });
      });
    });
  });

  describe('ok', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should be ${isOk ? `Some(${value})` : 'None'}`, () => {
          const res = result.ok();
          expect(res.isSome()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('err', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should be ${isOk ? 'None' : `Some(${value})`}`, () => {
          const res = result.err();
          expect(res.isSome()).toStrictEqual(!isOk);
          if (!isOk) {
            expect(res.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('toAsyncResult', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should be AsyncResult`, async () => {
          const asyncResult = result.toAsyncResult();
          expect(asyncResult).toBeInstanceOf(AsyncResult);
          const awaited = await asyncResult.promise;
          expect(awaited.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(awaited.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('toString', () => {
    testCases.forEach(({ name, result }) => {
      describe(name, () => {
        test(`should be ${name}`, async () => {
          expect(result.toString()).toStrictEqual(name);
        });
      });
    });
  });
});
