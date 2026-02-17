import { describe, expect, it, vi } from "vitest";
import { Err, Ok, Result } from "./result"; // путь поправь

describe("ok", () => {
	it("isOk/isErr работают", () => {
		const r = Ok<number, string>(5);
		expect(r.isOk()).toBe(true);
		expect(r.isErr()).toBe(false);
	});

	it("unwrap/expect возвращают значение", () => {
		const r = Ok<number, string>(10);
		expect(r.unwrap()).toBe(10);
		expect(r.expect("err")).toBe(10);
	});

	it("map трансформирует значение", () => {
		const r = Ok<number, string>(2).map(x => x * 3);
		expect(r.unwrap()).toBe(6);
	});

	it("mapErr игнорируется", () => {
		const r = Ok<number, string>(2).mapErr(() => "boom");
		expect(r.unwrap()).toBe(2);
	});

	it("andThen чейнит", () => {
		const r = Ok<number, string>(2).andThen(x => Ok(x + 5));
		expect(r.unwrap()).toBe(7);
	});

	it("or/orElse игнорируются", () => {
		expect(Ok<number, string>(1).or(Ok(2)).unwrap()).toBe(1);

		const spy = vi.fn(() => Ok<number, string>(2));
		const r = Ok<number, string>(1).orElse(spy);
		expect(r.unwrap()).toBe(1);
		expect(spy).not.toHaveBeenCalled();
	});

	it("unwrapErr кидает", () => {
		expect(() => Ok<number, string>(1).unwrapErr()).toThrow();
	});

	it("unwrapOr/unwrapOrElse игнорируют дефолт", () => {
		expect(Ok<number, string>(5).unwrapOr(0)).toBe(5);

		const spy = vi.fn(() => 0);
		const r = Ok<number, string>(5).unwrapOrElse(spy);
		expect(r).toBe(5);
		expect(spy).not.toHaveBeenCalled();
	});

	it("match вызывает Ok ветку", () => {
		const r = Ok<number, string>(3).match({
			Ok: v => v * 2,
			Err: () => 0,
		});
		expect(r).toBe(6);
	});

	it("toOption возвращает Some", () => {
		const opt = Ok<number, string>(5).toOption();
		expect(opt.isSome()).toBe(true);
		expect(opt.unwrap()).toBe(5);
	});
});

describe("err", () => {
	it("isOk/isErr работают", () => {
		const r = Err<number, string>("boom");
		expect(r.isOk()).toBe(false);
		expect(r.isErr()).toBe(true);
	});

	it("unwrap кидает с сообщением", () => {
		expect(() => Err<number, string>("boom").unwrap()).toThrow();
	});

	it("expect кидает с сообщением", () => {
		expect(() => Err<number, string>("boom").expect("fail")).toThrow("fail");
	});

	it("unwrapErr возвращает ошибку", () => {
		const r = Err<number, string>("boom");
		expect(r.unwrapErr()).toBe("boom");
	});

	it("map игнорируется", () => {
		const r = Err<number, string>("boom").map(x => x * 2);
		expect(r.isErr()).toBe(true);
	});

	it("mapErr трансформирует ошибку", () => {
		const r = Err<number, string>("boom").mapErr(e => e.toUpperCase());
		expect(r.unwrapErr()).toBe("BOOM");
	});

	it("andThen игнорируется", () => {
		const r = Err<number, string>("boom").andThen(() => Ok(1));
		expect(r.isErr()).toBe(true);
	});

	it("or возвращает fallback", () => {
		const r = Err<number, string>("boom").or(Ok(5));
		expect(r.unwrap()).toBe(5);
	});

	it("orElse вызывает функцию", () => {
		const spy = vi.fn(() => Ok<number, string>(6));
		const r = Err<number, string>("boom").orElse(spy);

		expect(spy).toHaveBeenCalled();
		expect(r.unwrap()).toBe(6);
	});

	it("unwrapOr возвращает дефолт", () => {
		expect(Err<number, string>("boom").unwrapOr(10)).toBe(10);
	});

	it("unwrapOrElse вызывает функцию", () => {
		const spy = vi.fn(() => 11);
		const r = Err<number, string>("boom").unwrapOrElse(spy);

		expect(spy).toHaveBeenCalled();
		expect(r).toBe(11);
	});

	it("match вызывает Err ветку", () => {
		const r = Err<number, string>("boom").match({
			Ok: () => 1,
			Err: e => e.length,
		});
		expect(r).toBe(4);
	});

	it("toOption возвращает None", () => {
		const opt = Err<number, string>("boom").toOption();
		expect(opt.isNone()).toBe(true);
	});
});

describe("result.try", () => {
	it("возвращает Ok если без ошибки", () => {
		const r = Result.try(() => 5);
		expect(r.isOk()).toBe(true);
		expect(r.unwrap()).toBe(5);
	});

	it("возвращает Err если ошибка", () => {
		const r = Result.try(() => {
			throw new Error("boom");
		});
		expect(r.isErr()).toBe(true);
	});

	it("мапит ошибку через onError", () => {
		const r = Result.try(
			() => {
				throw new Error("boom");
			},
			() => "mapped",
		);

		expect(r.unwrapErr()).toBe("mapped");
	});
});

describe("result.tryAsync", () => {
	it("возвращает Ok", async () => {
		const r = await Result.tryAsync(async () => 5);
		expect(r.isOk()).toBe(true);
		expect(r.unwrap()).toBe(5);
	});

	it("возвращает Err", async () => {
		const r = await Result.tryAsync(async () => {
			throw new Error("boom");
		});
		expect(r.isErr()).toBe(true);
	});
});

describe("result.all", () => {
	it("собирает все Ok", () => {
		const r = Result.all([Ok(1), Ok(2), Ok(3)]);
		expect(r.unwrap()).toEqual([1, 2, 3]);
	});

	it("возвращает первый Err", () => {
		const r = Result.all([Ok(1), Err<number, string>("boom"), Ok(3)]);
		expect(r.isErr()).toBe(true);
		expect(r.unwrapErr()).toBe("boom");
	});
});

describe("result.allAsync", () => {
	it("собирает все Ok", async () => {
		const r = await Result.allAsync([
			Promise.resolve(Ok(1)),
			Promise.resolve(Ok(2)),
		]);

		expect(r.unwrap()).toEqual([1, 2]);
	});

	it("возвращает Err", async () => {
		const r = await Result.allAsync([
			Promise.resolve(Ok(1)),
			Promise.resolve(Err<number, string>("boom")),
		]);

		expect(r.isErr()).toBe(true);
	});
});

describe("result.any", () => {
	it("возвращает первый Ok", () => {
		const r = Result.any([
			Err<number, string>("a"),
			Ok(5),
			Err<number, string>("b"),
		]);

		expect(r.unwrap()).toBe(5);
	});

	it("возвращает Err со всеми ошибками", () => {
		const r = Result.any([
			Err<number, string>("a"),
			Err<number, string>("b"),
		]);

		expect(r.isErr()).toBe(true);
		expect(r.unwrapErr()).toEqual(["a", "b"]);
	});
});
