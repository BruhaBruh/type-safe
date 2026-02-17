/* eslint-disable ts/no-redeclare */
import type { Tagged } from "type-fest";
import type { Option } from "@/option";
import { None, Some } from "@/option";

interface Base<T, E> {
	isOk: () => boolean;
	isErr: () => boolean;

	map: <R>(fn: (value: T) => R) => Result<R, E>;
	mapErr: <R>(fn: (value: E) => R) => Result<T, R>;
	andThen: <R>(fn: (value: T) => Result<R, E>) => Result<R, E>;
	or: (fallback: Result<T, E>) => Result<T, E>;
	orElse: (fn: () => Result<T, E>) => Result<T, E>;

	expect: (msg: string) => T;
	unwrap: (msg?: string) => T;
	unwrapErr: () => E;
	unwrapOr: (defaultValue: T) => T;
	unwrapOrElse: (fn: () => T) => T;

	match: <R>(matcher: { Ok: (value: T) => R; Err: (value: E) => R }) => R;

	toOption: () => Option<T>;
}

export type Result<T, E> = Tagged<Base<T, E>, "Error">;

export type Ok<T> = Result<T, unknown>;

export type Err<T> = Result<unknown, T>;

export function Ok<T, E>(value: T): Result<T, E> {
	const ok: Base<T, E> & { readonly value: T } = {
		value,
		isOk(): boolean {
			return true;
		},
		isErr(): boolean {
			return false;
		},
		map<R>(fn: (value: T) => R): Result<R, E> {
			return Ok(fn(this.value));
		},
		mapErr<R>(_fn: (value: E) => R): Result<T, R> {
			return this as unknown as Result<T, R>;
		},
		andThen<R>(fn: (value: T) => Result<R, E>): Result<R, E> {
			return fn(this.value);
		},
		or(_fallback: Result<T, E>): Result<T, E> {
			return this as Base<T, E> as Result<T, E>;
		},
		orElse(_fn: () => Result<T, E>): Result<T, E> {
			return this as Base<T, E> as Result<T, E>;
		},
		expect(_msg: string): T {
			return this.value;
		},
		unwrap(_msg?: string): T {
			return this.value;
		},
		unwrapErr(): E {
			throw new Error(`called unwrapErr() on Ok: ${String(value)}`);
		},
		unwrapOr(_defaultValue: T): T {
			return this.value;
		},
		unwrapOrElse(_fn: () => T): T {
			return this.value;
		},
		match<R>(matcher: { Ok: (value: T) => R; Err: (value: E) => R }): R {
			return matcher.Ok(this.value);
		},
		toOption(): Option<T> {
			return Some(this.value);
		},
	};

	return ok as Base<T, E> as Result<T, E>;
}

export function Err<T, E>(error: E): Result<T, E> {
	const err: Base<T, E> & { readonly error: E } = {
		error,
		isOk(): boolean {
			return false;
		},
		isErr(): boolean {
			return true;
		},
		map<R>(_fn: (value: T) => R): Result<R, E> {
			return this as unknown as Result<R, E>;
		},
		mapErr<R>(fn: (value: E) => R): Result<T, R> {
			return Err(fn(this.error));
		},
		andThen<R>(_fn: (value: T) => Result<R, E>): Result<R, E> {
			return this as unknown as Result<R, E>;
		},
		or(fallback: Result<T, E>): Result<T, E> {
			return fallback;
		},
		orElse(fn: () => Result<T, E>): Result<T, E> {
			return fn();
		},
		expect(msg: string): T {
			throw new Error(msg);
		},
		unwrap(msg?: string): T {
			throw new Error(msg ?? `called unwrap() on Err: ${String(this.error)}`);
		},
		unwrapErr(): E {
			return this.error;
		},
		unwrapOr(defaultValue: T): T {
			return defaultValue;
		},
		unwrapOrElse(fn: () => T): T {
			return fn();
		},
		match<R>(matcher: { Ok: (value: T) => R; Err: (value: E) => R }): R {
			return matcher.Err(this.error);
		},
		toOption(): Option<T> {
			return None();
		},
	};

	return err as Base<T, E> as Result<T, E>;
}

export const Result = {
	ok: Ok,
	err: Err,
	try<T, E>(fn: () => T, onError?: (e: unknown) => E): Result<T, E> {
		try {
			return Ok(fn());
		}
		catch (e) {
			return Err(onError ? onError(e) : (e as E));
		}
	},
	async tryAsync<T, E>(fn: () => Promise<T>, onError?: (e: unknown) => E): Promise<Result<T, E>> {
		try {
			return Ok(await fn() as T);
		}
		catch (e) {
			return Err(onError ? onError(e) : (e as E));
		}
	},
	all<T, E>(results: Result<T, E>[]): Result<T[], E> {
		const values: T[] = [];
		for (const r of results) {
			if (r.isErr())
				return Err(r.unwrapErr());
			values.push(r.unwrap());
		}
		return Ok(values);
	},
	async allAsync<T, E>(results: Promise<Result<T, E>>[]): Promise<Result<T[], E>> {
		return this.all(await Promise.all(results));
	},
	any<T, E>(results: Result<T, E>[]): Result<T, E[]> {
		const errors: E[] = [];
		for (const r of results) {
			if (r.isOk())
				return Ok(r.unwrap());
			errors.push(r.unwrapErr());
		}
		return Err(errors);
	},
};
