import { mutationUpdateCoordinates } from "../individuals";

describe("Individuals", () => {
  describe("Update individual geolocation in database", () => {
    // Assert if setTimeout was called properly
    it("Saves new individual geolocation to Hasura", async () => {
      expect(
        await mutationUpdateCoordinates({
          "id":19,
          "coordinates":{
            "latitude":"-23.0158877",
            "longitude":"-45.53779979999999"
          },
          "address":"Jardim Ana Emilia, Taubaté - SP, 12070-620, Brazil","state":"SP",
          "city": "Taubaté"
        })
      ).toEqual({
        id: 19,
        coordinates: {
          latitude: "-23.0158877",
          longitude: "-45.53779979999999"
        },
        address: "Jardim Ana Emilia, Taubaté - SP, 12070-620, Brazil",
        state: "SP",
        city: "Taubaté",
        __typename: "rede_individuals"
      })
    });
  });
});
