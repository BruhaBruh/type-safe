import { Err, Ok, Result } from './result';

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

  describe('andThen', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const ok = Ok(100);
        const err = Err(0);

        test(`should be ${isOk ? ok : result}: ${ok}`, async () => {
          const res = await result.toAsyncResult().andThen(() => ok).promise;
          expect(res.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(100);
          } else {
            expect(res.unwrapErr()).toStrictEqual(result.unwrapErr());
          }
        });

        test(`should be ${isOk ? err : result}: ${err}`, async () => {
          const res = await result.toAsyncResult().andThen(() => err).promise;
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

        test(`should be ${isOk ? result : ok}: ${ok}`, async () => {
          const res = await result.toAsyncResult().or(ok).promise;
          expect(res.isOk()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(isOk ? result.unwrap() : 100);
          }
        });

        test(`should be ${isOk ? result : err}: ${err}`, async () => {
          const res = await result.toAsyncResult().or(err).promise;
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

        test(`should be ${isOk ? result : ok}: ${ok}`, async () => {
          const res = await result.toAsyncResult().orElse(() => ok).promise;
          expect(res.isOk()).toStrictEqual(true);
          if (isOk) {
            expect(res.unwrap()).toStrictEqual(isOk ? result.unwrap() : 100);
          }
        });

        test(`should be ${isOk ? result : err}: ${err}`, async () => {
          const res = await result.toAsyncResult().orElse(() => err).promise;
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

        test(`should be ${isOk ? ok : result}: ${ok}`, async () => {
          const mapped = await result.toAsyncResult().map(() => ok).promise;
          expect(mapped.isOk()).toStrictEqual(isOk);
          if (isOk) {
            expect(mapped.unwrap()).toStrictEqual(ok);
          }
        });
      });
    });
  });

  describe('mapErr', () => {
    testCases.forEach(({ name, result, isOk }) => {
      describe(name, () => {
        const err = 100;

        test(`should be ${isOk ? result : err}: ${err}`, async () => {
          const mapped = await result.toAsyncResult().mapErr(() => err).promise;
          expect(mapped.isOk()).toStrictEqual(isOk);
          if (!isOk) {
            expect(mapped.unwrapErr()).toStrictEqual(err);
          }
        });
      });
    });
  });

  describe('ok', () => {
    testCases.forEach(({ name, result, isOk, value }) => {
      describe(name, () => {
        test(`should be ${isOk ? `Some(${value})` : 'None'}`, async () => {
          const res = await result.toAsyncResult().ok().promise;
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
        test(`should be ${isOk ? 'None' : `Some(${value})`}`, async () => {
          const res = await result.toAsyncResult().err().promise;
          expect(res.isSome()).toStrictEqual(!isOk);
          if (!isOk) {
            expect(res.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });
});
