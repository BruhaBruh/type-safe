/* eslint-disable @typescript-eslint/no-use-before-define */
import { None, Option, Some } from '../option';
import { AsyncResult } from './async-result';

interface BaseResult<T, E> {
  isOk(): this is Ok<T>;

  isOkAnd(fn: (value: T) => boolean): boolean;

  isErr(): this is Err<E>;

  isErrAnd(fn: (error: E) => boolean): boolean;

  and<U>(result: Result<U, E>): Result<U, E>;

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  or<F>(result: Result<T, F>): Result<T, F>;

  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  map<U>(fn: (value: T) => U): Result<U, E>;

  mapOr<U>(defaultValue: U, fn: (value: T) => U): U;

  mapOrElse<U>(defaultValue: (error: E) => U, fn: (value: T) => U): U;

  mapErr<F>(fn: (error: E) => F): Result<T, F>;

  expect(msg: string): T;

  expectErr(msg: string): E;

  inspect(fn: (value: T) => void): Result<T, E>;

  inspectErr(fn: (error: E) => void): Result<T, E>;

  unwrap(): T;

  unwrapErr(): E;

  unwrapOr(defaultValue: T): T;

  unwrapOrElse(fn: (error: E) => T): T;

  ok(): Option<T>;

  err(): Option<E>;

  toAsyncResult(): AsyncResult<T, E>;

  toString(): string;
}

export type Result<T, E> = BaseResult<T, E>;

class OkImpl<T> implements BaseResult<T, never> {
  readonly #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  isOk(): this is Ok<T> {
    return true;
  }

  isOkAnd(fn: (value: T) => boolean): boolean {
    return fn(this.#value);
  }

  isErr(): this is Err<never> {
    return false;
  }

  isErrAnd(_fn: unknown): boolean {
    return false;
  }

  and<U>(result: Result<U, never>): Result<U, never> {
    return result;
  }

  andThen<U>(fn: (value: T) => Result<U, never>): Result<U, never> {
    return fn(this.#value);
  }

  or<F>(_result: Result<T, F>): Result<T, F> {
    return this;
  }

  orElse<F>(_fn: unknown): Result<T, F> {
    return this;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return Ok(fn(this.#value));
  }

  mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
    return fn(this.#value);
  }

  mapOrElse<U>(_defaultValue: unknown, fn: (value: T) => U): U {
    return fn(this.#value);
  }

  mapErr<F>(_fn: unknown): Result<T, F> {
    return this;
  }

  expect(_msg: string): T {
    return this.#value;
  }

  expectErr(msg: string): never {
    throw new Error(msg);
  }

  inspect(fn: (value: T) => void): Result<T, never> {
    fn(this.#value);
    return this;
  }

  inspectErr(_fn: unknown): Result<T, never> {
    return this;
  }

  unwrap(): T {
    return this.#value;
  }

  unwrapErr(): never {
    throw new Error(`Tried to unwrap Ok`);
  }

  unwrapOr(_defaultValue: T): T {
    return this.#value;
  }

  unwrapOrElse(_fn: unknown): T {
    return this.#value;
  }

  ok(): Option<T> {
    return Some(this.#value);
  }

  err(): Option<never> {
    return None;
  }

  toAsyncResult(): AsyncResult<T, never> {
    return new AsyncResult(this);
  }

  toString(): string {
    return `Ok(${this.asString(this.#value)})`;
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

export const Ok = (<T>(val: T) => new OkImpl<T>(val)) as typeof OkImpl &
  (<T>(val: T) => Ok<T>);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Ok<T> = OkImpl<T>;

class ErrImpl<E> implements BaseResult<never, E> {
  readonly #error: E;

  constructor(error: E) {
    this.#error = error;
  }

  isOk(): this is Ok<never> {
    return false;
  }

  isOkAnd(_fn: unknown): boolean {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  isErrAnd(fn: (error: E) => boolean): boolean {
    return fn(this.#error);
  }

  and<U>(_result: Result<U, E>): Result<U, E> {
    return this;
  }

  andThen<U>(_fn: unknown): Result<U, E> {
    return this;
  }

  or<F>(result: Result<never, F>): Result<never, F> {
    return result;
  }

  orElse<F>(fn: (error: E) => Result<never, F>): Result<never, F> {
    return fn(this.#error);
  }

  map<U>(_fn: unknown): Result<U, E> {
    return this;
  }

  mapOr<U>(defaultValue: U, _fn: unknown): U {
    return defaultValue;
  }

  mapOrElse<U>(defaultValue: (error: E) => U, _fn: unknown): U {
    return defaultValue(this.#error);
  }

  mapErr<F>(fn: (error: E) => F): Result<never, F> {
    return Err(fn(this.#error));
  }

  expect(msg: string): never {
    throw new Error(msg);
  }

  expectErr(_msg: string): E {
    return this.#error;
  }

  inspect(_fn: unknown): Result<never, E> {
    return this;
  }

  inspectErr(fn: (error: E) => void): Result<never, E> {
    fn(this.#error);
    return this;
  }

  unwrap(): never {
    throw new Error(`Tried to unwrap Err`);
  }

  unwrapErr(): E {
    return this.#error;
  }

  unwrapOr<T2>(defaultValue: T2): T2 {
    return defaultValue;
  }

  unwrapOrElse<T2>(fn: (error: E) => T2): T2 {
    return fn(this.#error);
  }

  ok(): Option<never> {
    return None;
  }

  err(): Option<E> {
    return Some(this.#error);
  }

  toAsyncResult(): AsyncResult<never, E> {
    return new AsyncResult<never, E>(this);
  }

  toString(): string {
    return `Err(${this.asString(this.#error)})`;
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

export const Err = (<T>(error: T) => new ErrImpl<T>(error)) as typeof ErrImpl &
  (<T>(error: T) => Err<T>);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Err<T> = ErrImpl<T>;
