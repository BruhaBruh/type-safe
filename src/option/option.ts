/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Result } from '../result';
import { Err, Ok } from '../result';
import { AsyncOption } from './async-option';

interface BaseOption<T> {
  isSome(): this is Some<T>;

  isSomeAnd(fn: (value: T) => boolean): boolean;

  isNone(): this is None;

  isNoneOr(fn: (value: T) => boolean): boolean;

  and<U>(option: Option<U>): Option<U>;

  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  or(option: Option<T>): Option<T>;

  orElse(fn: () => Option<T>): Option<T>;

  map<U>(fn: (value: T) => U): Option<U>;

  mapOr<U>(defaultValue: U, fn: (value: T) => U): U;

  mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U): U;

  expect(msg: string): T;

  inspect(fn: (value: T) => void): Option<T>;

  unwrap(): T;

  unwrapOr(defaultValue: T): T;

  unwrapOrElse(fn: () => T): T;

  filter(fn: (value: T) => boolean): Option<T>;

  okOr<E>(error: E): Result<T, E>;

  okOrElse<E>(fn: () => E): Result<T, E>;

  toAsyncOption(): AsyncOption<T>;

  toString(): string;
}

export type Option<T> = BaseOption<T>;

class NoneImpl implements BaseOption<never> {
  isSome(): this is Some<never> {
    return false;
  }

  isSomeAnd(_fn: (value: never) => boolean): boolean {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  isNoneOr(_fn: (value: never) => boolean): boolean {
    return true;
  }

  and<U>(_option: Option<U>): Option<U> {
    return this;
  }

  andThen<U>(_fn: unknown): Option<U> {
    return this;
  }

  or<T2>(option: Option<T2>): Option<T2> {
    return option;
  }

  orElse<T2>(fn: () => Option<T2>): Option<T2> {
    return fn();
  }

  map(_fn: unknown): None {
    return this;
  }

  mapOr<U>(defaultValue: U, _fn: unknown): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultValue: () => U, _fn: unknown): U {
    return defaultValue();
  }

  expect(msg: string): never {
    throw new Error(msg);
  }

  inspect(_fn: (value: never) => void): None {
    return this;
  }

  unwrap(): never {
    throw new Error(`Tried to unwrap None`);
  }

  unwrapOr<T2>(defaultValue: T2): T2 {
    return defaultValue;
  }

  unwrapOrElse<T2>(fn: () => T2): T2 {
    return fn();
  }

  filter(_fn: unknown): Option<never> {
    return this;
  }

  okOr<E>(error: E): Result<never, E> {
    return Err(error);
  }

  okOrElse<E>(fn: () => E): Result<never, E> {
    return Err(fn());
  }

  toAsyncOption(): AsyncOption<never> {
    return new AsyncOption<never>(this);
  }

  toString(): string {
    return 'None';
  }
}

export const None = new NoneImpl();
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type None = NoneImpl;
Object.freeze(None);

class SomeImpl<T> implements BaseOption<T> {
  static readonly EMPTY = new SomeImpl<void>(undefined);
  readonly #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  isSome(): this is Some<T> {
    return true;
  }

  isSomeAnd(fn: (value: T) => boolean): boolean {
    return fn(this.#value);
  }

  isNone(): this is None {
    return false;
  }

  isNoneOr(fn: (value: T) => boolean): boolean {
    return fn(this.#value);
  }

  and<U>(option: Option<U>): Option<U> {
    return option;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.#value);
  }

  or(_option: Option<T>): Option<T> {
    return this;
  }

  orElse(_fn: () => Option<T>): Option<T> {
    return this;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return Some(fn(this.#value));
  }

  mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
    return fn(this.#value);
  }

  mapOrElse<U>(_defaultValue: () => U, fn: (value: T) => U): U {
    return fn(this.#value);
  }

  expect(_msg: string): T {
    return this.#value;
  }

  inspect(fn: (value: T) => void): Option<T> {
    fn(this.#value);
    return this;
  }

  unwrap(): T {
    return this.#value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.#value;
  }

  unwrapOrElse(_fn: () => T): T {
    return this.#value;
  }

  filter(fn: (value: T) => boolean): Option<T> {
    return fn(this.#value) ? this : None;
  }

  okOr<E>(_error: E): Result<T, E> {
    return Ok(this.#value);
  }

  okOrElse<E>(_fn: () => E): Result<T, E> {
    return Ok(this.#value);
  }

  toAsyncOption(): AsyncOption<T> {
    return new AsyncOption(this);
  }

  toString(): string {
    return `Some(${this.asString(this.#value)})`;
  }

  private asString(val: unknown): string {
    let value = String(val);
    if (value === '[object Object]') {
      try {
        value = JSON.stringify(val);
      } catch {}
    }
    if (typeof val === 'string') {
      value = `"${value}"`;
    }
    return value;
  }
}

export const Some = (<T>(val: T) => new SomeImpl<T>(val)) as typeof SomeImpl &
  (<T>(val: T) => Some<T>);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Some<T> = SomeImpl<T>;
