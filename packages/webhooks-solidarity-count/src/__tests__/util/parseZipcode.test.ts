import parseZipcode from "../../util/parseZipcode";

describe("parseZipcode tests", () => {
  test("function never returns undefined or null", () => {
    const isUndefined = parseZipcode(undefined);

    expect(isUndefined).not.toBeUndefined();

    expect(isUndefined).toBe("");
  });
  test("function returns only numbers inside string", () => {
    const isNumber = parseZipcode("123123");
    const hasOtherCaracters = parseZipcode("fsdfdsf123123##@@@#");

    expect(typeof Number(isNumber)).toBe("number");
    expect(isNumber).toBe("123123");

    expect(typeof Number(hasOtherCaracters)).toBe("number");
    expect(typeof Number(hasOtherCaracters)).not.toBeNaN();
  });
});
