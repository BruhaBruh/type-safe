import { AsyncOption } from '../option';
import type { Result } from './result';
import { Err, Ok } from './result';

export class AsyncResult<T, E> {
  readonly promise: Promise<Result<T, E>>;

  constructor(start: Result<T, E> | Promise<Result<T, E>>) {
    this.promise = Promise.resolve(start);
  }

  andThen<T2>(
    mapper: (
      val: T,
    ) => Result<T2, E> | Promise<Result<T2, E>> | AsyncResult<T2, E>,
  ): AsyncResult<T2, E> {
    return this.thenInternal<T2, E>(async (result) => {
      if (result.isErr()) {
        return result;
      }
      const mapped = mapper(result.unwrap());
      return mapped instanceof AsyncResult ? mapped.promise : mapped;
    });
  }

  or<F>(
    other: Result<T, F> | AsyncResult<T, F> | Promise<Result<T, F>>,
  ): AsyncResult<T, F> {
    return this.orElse(() => other);
  }

  orElse<F>(
    other: (
      error: E,
    ) => Result<T, F> | AsyncResult<T, F> | Promise<Result<T, F>>,
  ): AsyncResult<T, F> {
    return this.thenInternal(async (result) => {
      if (result.isOk()) {
        return result;
      }
      const otherValue = other(result.unwrapErr());
      return otherValue instanceof AsyncResult
        ? otherValue.promise
        : otherValue;
    });
  }

  map<U>(mapper: (val: T) => U | Promise<U>): AsyncResult<U, E> {
    return this.thenInternal<U, E>(async (result) => {
      if (result.isErr()) {
        return result;
      }
      return Ok(await mapper(result.unwrap()));
    });
  }

  mapErr<F>(mapper: (val: E) => F | Promise<F>): AsyncResult<T, F> {
    return this.thenInternal<T, F>(async (result) => {
      if (result.isOk()) {
        return result;
      }
      return Err(await mapper(result.unwrapErr()));
    });
  }

  ok(): AsyncOption<T> {
    return new AsyncOption(this.promise.then((result) => result.ok()));
  }

  err(): AsyncOption<E> {
    return new AsyncOption(this.promise.then((result) => result.err()));
  }

  private thenInternal<T2, E2>(
    mapper: (result: Result<T, E>) => Promise<Result<T2, E2>>,
  ): AsyncResult<T2, E2> {
    return new AsyncResult(this.promise.then(mapper));
  }
}
