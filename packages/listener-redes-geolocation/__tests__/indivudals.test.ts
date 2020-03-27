import { geolocation } from "../src/individuals";

describe("geolocation function", async () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      HASURA_SECRET: "1111111",
      GOOGLE_MAPS_API_KEY: "222222"
    });
  });

  // Assert if setTimeout was called properly
  it.skip("google maps api key present", async () => {
    expect(
      await geolocation({
        data: {
          rede_individuals: []
        }
      })
    ).toEqual({
      error: 1
    });
  });
});
