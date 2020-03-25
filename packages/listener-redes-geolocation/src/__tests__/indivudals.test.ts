import { geolocation } from "../individuals";

describe("Individuals", async () => {
  describe("Update individual data in database", async () => {
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
});
