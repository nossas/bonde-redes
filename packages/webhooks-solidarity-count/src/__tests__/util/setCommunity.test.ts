import setCommunity from "../../util/setCommunity";

describe("setCommunity tests", () => {
  test("it returns a new object with a number community_id property", () => {
    const { COMMUNITY_ID } = process.env;
    expect(COMMUNITY_ID).toBeTruthy();

    const dummy = {
      a: 10,
      b: "etc"
    };

    const answer = setCommunity(dummy);
    expect(answer.a === 10);
    expect(answer.b === "etc");
    expect(typeof answer.community_id).toBe("number");
    expect(Number.isNaN(answer.community_id)).toBeFalsy();
  });
});
