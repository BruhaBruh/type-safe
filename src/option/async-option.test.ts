import { None, Option, Some } from './option';

describe('AsyncOption', () => {
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

  describe('andThen', () => {
    testCases.forEach(({ name, option, isSome }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? opt : None}: ${opt}`, async () => {
          const result = await option.toAsyncOption().andThen(() => opt)
            .promise;
          expect(result.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${None}: ${None}`, async () => {
          const result = await option.toAsyncOption().andThen(() => None)
            .promise;
          expect(result.isSome()).toStrictEqual(false);
        });
      });
    });
  });

  describe('or', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const opt = Some(100);
        test(`should be ${isSome ? option : opt}: ${opt}`, async () => {
          const result = await option.toAsyncOption().or(opt).promise;
          expect(result.isSome()).toStrictEqual(true);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${isSome ? option : None}: ${None}`, async () => {
          const result = await option.toAsyncOption().or(None).promise;
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
        test(`should be ${isSome ? option : opt}: ${opt}`, async () => {
          const result = await option.toAsyncOption().orElse(() => opt).promise;
          expect(result.isSome()).toStrictEqual(true);
          if (isSome) {
            expect(result.unwrap()).toStrictEqual(value);
          } else {
            expect(result.unwrap()).toStrictEqual(100);
          }
        });

        test(`should be ${isSome ? option : None}: ${None}`, async () => {
          const result = await option.toAsyncOption().orElse(() => None)
            .promise;
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
        test(`should be ${isSome ? opt : None}: ${opt}`, async () => {
          const mapped = await option.toAsyncOption().map(() => opt).promise;
          expect(mapped.isSome()).toStrictEqual(isSome);
          if (isSome) {
            expect(mapped.unwrap()).toStrictEqual(100);
          }
        });
      });
    });
  });

  describe('okOr', () => {
    testCases.forEach(({ name, option, isSome, value }) => {
      describe(name, () => {
        const err = 'Some Error';
        test(`should be ${isSome ? `Ok(${value})` : `Err("${err}")`}: "${err}"`, async () => {
          const result = await option.toAsyncOption().okOr(err).promise;
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
        test(`should be ${isSome ? `Ok(${value})` : `Err("${err}")`}: "${err}"`, async () => {
          const result = await option.toAsyncOption().okOrElse(() => err)
            .promise;
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
});
