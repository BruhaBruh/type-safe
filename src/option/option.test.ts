import { describe, expect, it, vi } from "vitest";
import { None, Option, Some } from "./option"; // путь поправь

describe("some", () => {
	it("isSome/isNone работают", () => {
		const s = Some(1);
		expect(s.isSome()).toBe(true);
		expect(s.isNone()).toBe(false);
	});

	it("unwrap возвращает значение", () => {
		expect(Some(42).unwrap()).toBe(42);
	});

	it("expect возвращает значение", () => {
		expect(Some("hello").expect("err")).toBe("hello");
	});

	it("map трансформирует значение", () => {
		const result = Some(2).map(x => x * 2);
		expect(result.unwrap()).toBe(4);
	});

	it("andThen чейнит Option", () => {
		const result = Some(2).andThen(x => Some(x + 3));
		expect(result.unwrap()).toBe(5);
	});

	it("or игнорирует fallback", () => {
		const result = Some(1).or(Some(2));
		expect(result.unwrap()).toBe(1);
	});

	it("orElse игнорирует fallback функцию (ленивость)", () => {
		const spy = vi.fn(() => Some(2));
		const result = Some(1).orElse(spy);

		expect(result.unwrap()).toBe(1);
		expect(spy).not.toHaveBeenCalled();
	});

	it("unwrapOr игнорирует дефолт", () => {
		expect(Some(10).unwrapOr(0)).toBe(10);
	});

	it("unwrapOrElse игнорирует функцию", () => {
		const spy = vi.fn(() => 0);
		const result = Some(10).unwrapOrElse(spy);

		expect(result).toBe(10);
		expect(spy).not.toHaveBeenCalled();
	});

	it("match вызывает ветку Some", () => {
		const result = Some(3).match({
			Some: v => v * 3,
			None: () => 0,
		});
		expect(result).toBe(9);
	});

	it("let вызывает функцию", () => {
		const spy = vi.fn();
		Some(5).let(spy);
		expect(spy).toHaveBeenCalledWith(5);
	});

	it("кидает если null", () => {
		expect(() => Some(null as any)).toThrow();
	});

	it("кидает если undefined", () => {
		expect(() => Some(undefined as any)).toThrow();
	});
});

describe("none", () => {
	it("isSome/isNone работают", () => {
		const n = None<number>();
		expect(n.isSome()).toBe(false);
		expect(n.isNone()).toBe(true);
	});

	it("unwrap кидает", () => {
		expect(() => None<number>().unwrap()).toThrow();
	});

	it("expect кидает с сообщением", () => {
		expect(() => None<number>().expect("boom")).toThrow("boom");
	});

	it("map не вызывает функцию и возвращает None", () => {
		const spy = vi.fn((x: number) => x * 2);
		const result = None<number>().map(spy);

		expect(spy).not.toHaveBeenCalled();
		expect(result.isNone()).toBe(true);
	});

	it("andThen не вызывает функцию и возвращает None", () => {
		const spy = vi.fn((x: number) => Some(x * 2));
		const result = None<number>().andThen(spy);

		expect(spy).not.toHaveBeenCalled();
		expect(result.isNone()).toBe(true);
	});

	it("or возвращает fallback", () => {
		const result = None<number>().or(Some(5));
		expect(result.unwrap()).toBe(5);
	});

	it("orElse вызывает функцию", () => {
		const spy = vi.fn(() => Some(6));
		const result = None<number>().orElse(spy);

		expect(spy).toHaveBeenCalled();
		expect(result.unwrap()).toBe(6);
	});

	it("unwrapOr возвращает дефолт", () => {
		expect(None<number>().unwrapOr(10)).toBe(10);
	});

	it("unwrapOrElse вызывает функцию", () => {
		const spy = vi.fn(() => 11);
		const result = None<number>().unwrapOrElse(spy);

		expect(spy).toHaveBeenCalled();
		expect(result).toBe(11);
	});

	it("match вызывает ветку None", () => {
		const result = None<number>().match({
			Some: () => 1,
			None: () => 2,
		});
		expect(result).toBe(2);
	});

	it("let ничего не делает", () => {
		const spy = vi.fn();
		None<number>().let(spy);
		expect(spy).not.toHaveBeenCalled();
	});
});

describe("option.from", () => {
	it("создаёт Some из значения", () => {
		const result = Option.from(5);
		expect(result.isSome()).toBe(true);
		expect(result.unwrap()).toBe(5);
	});

	it("создаёт None из null", () => {
		const result = Option.from(null);
		expect(result.isNone()).toBe(true);
		expect(() => result.unwrap()).toThrow();
	});

	it("создаёт None из undefined", () => {
		const result = Option.from(undefined);
		expect(result.isNone()).toBe(true);
		expect(() => result.unwrap()).toThrow();
	});
});
