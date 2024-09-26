import { AsyncOption } from './async-option';
import { None, Option, Some } from './option';

describe('Option', () => {
  const testCases: {
    value: unknown;
    option: Option<unknown>;
    name: string;
    isSome: boolean;
  }[] = [
    {
      value: 1,
      option: Some(1),
      name: 'Some(1)',
      isSome: true,
    },
    {
      value: 'raw',
      option: Some('raw'),
      name: 'Some("raw")',
      isSome: true,
    },
    {
      value: 'go',
      option: Some('go'),
      name: 'Some("go")',
      isSome: true,
    },
    {
      value: true,
      option: Some(true),
      name: 'Some(true)',
      isSome: true,
    },
    {
      value: false,
      option: Some(false),
      name: 'Some(false)',
      isSome: true,
    },
    {
      value: null,
      option: Some(null),
      name: 'Some(null)',
      isSome: true,
    },
    {
      value: undefined,
      option: Some(undefined),
      name: 'Some(undefined)',
      isSome: true,
    },
    {
      value: NaN,
      option: Some(NaN),
      name: 'Some(NaN)',
      isSome: true,
    },
    {
      value: { test: true },
      option: Some({ test: true }),
      name: 'Some({"test":true})',
      isSome: true,
    },
    {
      value: undefined,
      option: None,
      name: 'None',
      isSome: false,
    },
  ];

  describe('isSome', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be ${isSome}`, () => {
          expect(option.isSome()).toStrictEqual(isSome);
        });
      });
    });
  });

  describe('isSomeAnd', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be ${isSome}: truthy fn`, () => {
          expect(option.isSomeAnd(() => true)).toStrictEqual(isSome);
        });

        test(`should be false: falsy fn`, () => {
          expect(option.isSomeAnd(() => false)).toStrictEqual(false);
        });
      });
    });
  });

  describe('isNone', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be ${!isSome}`, () => {
          expect(option.isNone()).toStrictEqual(!isSome);
        });
      });
    });
  });

  describe('isNoneOr', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be true: truthy fn`, () => {
          expect(option.isNoneOr(() => true)).toStrictEqual(true);
        });

        test(`should be ${!isSome}: falsy fn`, () => {
          expect(option.isNoneOr(() => false)).toStrictEqual(!isSome);
        });
      });
    });
  });

  describe('and', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? opt : None}: ${opt}`, () => {
          const result = option.and(opt);
          expect(result.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${None}: ${None}`, () => {
          const result = option.and(None);
          expect(result.isSome()).toStrictEqual(false);
        });
      });
    });
  });

  describe('andThen', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? opt : None}: ${opt}`, () => {
          const result = option.andThen(() => opt);
          expect(result.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${None}: ${None}`, () => {
          const result = option.andThen(() => None);
          expect(result.isSome()).toStrictEqual(false);
        });
      });
    });
  });

  describe('or', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? option : opt}: ${opt}`, () => {
          const result = option.or(opt);
          expect(result.isSome()).toStrictEqual(true);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${isSome ? option : None}: ${None}`, () => {
          const result = option.or(None);
          expect(result.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('orElse', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? option : opt}: ${opt}`, () => {
          const result = option.orElse(() => opt);
          expect(result.isSome()).toStrictEqual(true);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${isSome ? option : None}: ${None}`, () => {
          const result = option.orElse(() => None);
          expect(result.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('map', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = 100;
        test(`should be ${isSome ? opt : None}: ${opt}`, () => {
          const mapped = option.map(() => opt);
          expect(mapped.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(mapped.unwrap()).toStrictEqual(opt);
          }
        });
      });
    });
  });

  describe('mapOr', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = 100;
        const defaultOpt = 1000;
        test(`should be ${isSome ? opt : defaultOpt}: ${defaultOpt} ${opt}`, () => {
          const mapped = option.mapOr(defaultOpt, () => opt);
          if (isSome) {
            expect(mapped).toStrictEqual(opt);
          } else {
            expect(mapped).toStrictEqual(defaultOpt);
          }
        });
      });
    });
  });

  describe('mapOrElse', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = 100;
        const defaultOpt = 1000;
        test(`should be ${isSome ? opt : defaultOpt}: ${defaultOpt} ${opt}`, () => {
          const mapped = option.mapOrElse(
            () => defaultOpt,
            () => opt,
          );
          if (isSome) {
            expect(mapped).toStrictEqual(opt);
          } else {
            expect(mapped).toStrictEqual(defaultOpt);
          }
        });
      });
    });
  });

  describe('expect', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const msg = 'Some Error';
        test(`should ${isSome ? `be ${value}` : `throw "${msg}"`}: "${msg}"`, () => {
          if (isSome) {
            const v = option.expect(msg);
            expect(v).toStrictEqual(value);
          } else {
            expect(() => option.expect(msg)).toThrowError(msg);
          }
        });
      });
    });
  });

  describe('inspect', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be called ${isSome ? 1 : 0} time(s)`, () => {
          const fn = vi.fn();
          option.inspect(fn);
          expect(fn).toBeCalledTimes(isSome ? 1 : 0);
        });
      });
    });
  });

  describe('unwrap', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        test(`should ${isSome ? `be ${value}` : `throw "Tried to unwrap None"`}`, () => {
          if (isSome) {
            const v = option.unwrap();
            expect(v).toStrictEqual(value);
          } else {
            expect(() => option.unwrap()).toThrowError('Tried to unwrap None');
          }
        });
      });
    });
  });

  describe('unwrapOr', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const defaultValue = 100;
        test(`should be ${isSome ? value : defaultValue}: ${defaultValue}`, () => {
          const v = option.unwrapOr(defaultValue);
          expect(v).toStrictEqual(isSome ? value : defaultValue);
        });
      });
    });
  });

  describe('unwrapOrElse', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const defaultValue = 100;
        test(`should be ${isSome ? value : defaultValue}: ${defaultValue}`, () => {
          const v = option.unwrapOrElse(() => defaultValue);
          expect(v).toStrictEqual(isSome ? value : defaultValue);
        });
      });
    });
  });

  describe('filter', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        test(`should be ${isSome ? option : None}: true`, () => {
          const v = option.filter(() => true);
          expect(v.isSome()).toStrictEqual(isSome);
        });
        test(`should be ${None}: false`, () => {
          const v = option.filter(() => false);
          expect(v.isSome()).toStrictEqual(false);
        });
      });
    });
  });

  describe('okOr', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const err = 'Some Error';
        test(`should be ${isSome ? `Ok(${value})` : `Err("${err}")`}: "${err}"`, () => {
          const result = option.okOr(err);
          if (isSome) {
            expect(result.isOk()).toStrictEqual(true);
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.isErr()).toStrictEqual(true);
            expect(result.unwrapErr()).toStrictEqual(err);
          }
        });
      });
    });
  });

  describe('okOrElse', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const err = 'Some Error';
        test(`should be ${isSome ? `Ok(${value})` : `Err("${err}")`}: "${err}"`, () => {
          const result = option.okOrElse(() => err);
          if (isSome) {
            expect(result.isOk()).toStrictEqual(true);
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.isErr()).toStrictEqual(true);
            expect(result.unwrapErr()).toStrictEqual(err);
          }
        });
      });
    });
  });

  describe('toAsyncOption', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        test(`should be AsyncOption`, async () => {
          const asyncOption = option.toAsyncOption();
          expect(asyncOption).toBeInstanceOf(AsyncOption);
          const awaited = await asyncOption.promise;
          expect(awaited.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(awaited.unwrap()).toStrictEqual(value);
          }
        });
      });
    });
  });

  describe('toString', () => {
    testCases.forEach(({ name, option }) => {
      describe(name, () => {
        test(`should be ${name}`, async () => {
          expect(option.toString()).toStrictEqual(name);
        });
      });
    });
  });
});
