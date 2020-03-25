import { convertCepToAddressWithGoogleApi } from "../geolocation";

describe("Geolocation", () => {
  describe("Get geolocation data from user zipcode", function() {
    it("When the input is invalid, it returns object with ZERO_RESULTS", async () => {
      expect(
        await convertCepToAddressWithGoogleApi({
          zipcode: "12990112",
          id: 1,
          created_at: "2020-12-10"
        })
      ).toEqual({
        error: 1,
        id: 1,
        coordinates: {
          latitude: "ZERO_RESULTS",
          longitude: "ZERO_RESULTS"
        },
        address: "Cep Incorreto - 12990112",
        state: "ZERO_RESULTS",
        city: "ZERO_RESULTS"
      });
    });
    it("When the input is valid, it returns an object with valid data", async () => {
      expect(
        await convertCepToAddressWithGoogleApi({
          zipcode: "01222001",
          id: 1,
          created_at: "2020-12-10"
        })
      ).toEqual({
        id: 1,
        coordinates: {
          latitude: "-23.5455809",
          longitude: "-46.6473778"
        },
        address:
          "Vila Buarque, São Paulo - State of São Paulo, 01222-001, Brazil",
        state: "SP",
        city: "São Paulo"
      });
    });
  });
});
