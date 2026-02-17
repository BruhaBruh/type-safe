/* eslint-disable ts/no-redeclare */
import type { Tagged } from "type-fest";

interface Base<T> {
	isSome: () => boolean;
	isNone: () => boolean;

	map: <R>(fn: (value: T) => R) => Option<R>;
	andThen: <R>(fn: (value: T) => Option<R>) => Option<R>;
	or: (fallback: Option<T>) => Option<T>;
	orElse: (fn: () => Option<T>) => Option<T>;

	expect: (msg: string) => T;
	unwrap: (msg?: string) => T;
	unwrapOr: (defaultValue: T) => T;
	unwrapOrElse: (fn: () => T) => T;

	match: <R>(matcher: { Some: (value: T) => R; None: () => R }) => R;

	let: (fn: (value: T) => void) => void;
}

export type Option<T> = Tagged<Base<T>, "Option">;

export type Some<T> = Option<T>;

export type None = Option<never>;

export function Some<T>(value: T): Option<T> {
	if (value === null || value === undefined) {
		throw new Error("Some value must be non nullable");
	}

	const some: Base<T> & { readonly value: T } = {
		value,
		isSome() {
			return true;
		},
		isNone() {
			return false;
		},
		map<R>(fn: (value: T) => R): Option<R> {
			return Some(fn(this.value));
		},
		andThen<R>(fn: (value: T) => Option<R>): Option<R> {
			return fn(this.value);
		},
		or(_fallback: Option<T>): Option<T> {
			return this as Base<T> as Some<T>;
		},
		orElse(_fn: () => Option<T>): Option<T> {
			return this as Base<T> as Some<T>;
		},
		expect(_msg: string): T {
			return this.value;
		},
		unwrap(_msg?: string): T {
			return this.value;
		},
		unwrapOr(_defaultValue: T): T {
			return this.value;
		},
		unwrapOrElse(_fn: () => T): T {
			return this.value;
		},
		match<R>(matcher: { Some: (value: T) => R; None: () => R }): R {
			return matcher.Some(this.value);
		},
		let(fn: (value: T) => void): void {
			fn(this.value);
		},
	};

	return some as Base<T> as Some<T>;
}

export function None<T>(): Option<T> {
	const none: Base<T> = {
		isSome() {
			return false;
		},
		isNone() {
			return true;
		},
		map<R>(_fn: (value: T) => R): Option<R> {
			return None<R>();
		},
		andThen<R>(_fn: (value: T) => Option<R>): Option<R> {
			return None<R>();
		},
		or(fallback: Option<T>): Option<T> {
			return fallback;
		},
		orElse(fn: () => Option<T>): Option<T> {
			return fn();
		},
		expect(msg: string): T {
			throw new Error(msg);
		},
		unwrap(msg: string = "called unwrap() on None"): T {
			throw new Error(msg);
		},
		unwrapOr(defaultValue: T): T {
			return defaultValue;
		},
		unwrapOrElse(fn: () => T): T {
			return fn();
		},
		match<R>(matcher: { Some: (value: T) => R; None: () => R }): R {
			return matcher.None();
		},
		let(_fn: (value: T) => void): void {
		},
	};

	return none as Option<T>;
}

export const Option = {
	some: Some,
	none: None,
	from<T>(value: T | null | undefined): Option<NonNullable<T>> {
		return value === null || value === undefined ? None() : Some(value);
	},
};
