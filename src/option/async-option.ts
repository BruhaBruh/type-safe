import { AsyncResult } from '@/result';
import { Option, Some } from './option';

export class AsyncOption<T> {
  readonly promise: Promise<Option<T>>;

  constructor(option: Option<T> | Promise<Option<T>>) {
    this.promise = Promise.resolve(option);
  }

  andThen<T2>(
    mapper: (val: T) => Option<T2> | Promise<Option<T2>> | AsyncOption<T2>,
  ): AsyncOption<T2> {
    return this.thenInternal(async (option) => {
      if (option.isNone()) {
        return option;
      }
      const mapped = mapper(option.unwrap());
      return mapped instanceof AsyncOption ? mapped.promise : mapped;
    });
  }

  or<U>(
    other: Option<U> | AsyncOption<U> | Promise<Option<U>>,
  ): AsyncOption<T | U> {
    return this.orElse(() => other);
  }

  orElse<U>(
    other: () => Option<U> | AsyncOption<U> | Promise<Option<U>>,
  ): AsyncOption<T | U> {
    return this.thenInternal(async (option): Promise<Option<T | U>> => {
      if (option.isSome()) {
        return option;
      }
      const otherValue = other();
      return otherValue instanceof AsyncOption
        ? otherValue.promise
        : otherValue;
    });
  }

  map<U>(mapper: (val: T) => U | Promise<U>): AsyncOption<U> {
    return this.thenInternal<U>(async (option) => {
      if (option.isNone()) {
        return option;
      }
      return Some(await mapper(option.unwrap()));
    });
  }

  okOr<E>(error: E): AsyncResult<T, E> {
    return new AsyncResult(this.promise.then((option) => option.okOr(error)));
  }

  okOrElse<E>(fn: () => E): AsyncResult<T, E> {
    return new AsyncResult(this.promise.then((option) => option.okOr(fn())));
  }

  private thenInternal<T2>(
    mapper: (option: Option<T>) => Promise<Option<T2>>,
  ): AsyncOption<T2> {
    return new AsyncOption(this.promise.then(mapper));
  }
}
