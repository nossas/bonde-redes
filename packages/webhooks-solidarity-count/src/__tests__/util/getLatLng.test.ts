import getLatLng from "../../util/getLatLng";
import faker from "faker/locale/pt_BR";

describe("getLatLng tests", () => {
  const data = ({
    latitude,
    longitude,
    address
  }: {
    latitude: string | null;
    longitude: string | null;
    address: string | null;
  }) => ({
    data: {
      results: [
        {
          geometry:
            latitude && longitude
              ? {
                  location: {
                    lat: latitude,
                    lng: longitude
                  }
                }
              : {},
          formatted_address: address
        }
      ]
    }
  });
  const zipcode = faker.address.zipCode();
  const invalidOutput = { latitude: null, longitude: null, address: null };

  it("should return valid lat/lng/address", async () => {
    const validOutput = {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      address: faker.address.streetAddress(true)
    };

    const mapsSuccess = jest.fn().mockResolvedValue(data(validOutput));
    const success = await getLatLng(zipcode, mapsSuccess);
    expect(success).toStrictEqual(validOutput);
  });

  it("should return a null lat/lng/address if ZERO_RESULTS", async () => {
    const mapsFailure = jest.fn().mockRejectedValue({
      results: [],
      status: "ZERO_RESULTS"
    });
    const failure = await getLatLng(zipcode, mapsFailure);
    expect(failure).toStrictEqual(invalidOutput);
  });

  it("should throw an error if there's no geometry", async () => {
    const noGeometry = {
      latitude: null,
      longitude: null,
      address: faker.address.streetAddress(true)
    };
    const mapsFailure = jest.fn().mockResolvedValue(data(noGeometry));
    const failure = await getLatLng(zipcode, mapsFailure);
    expect(failure).toStrictEqual(invalidOutput);
  });

  it("should not throw an error if there's no address", async () => {
    const noAddress = {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      address: ""
    };
    const mapsFailure = jest.fn().mockResolvedValue(data(noAddress));
    const success = await getLatLng(zipcode, mapsFailure);
    expect(success).not.toBe(invalidOutput);
    expect(success).toStrictEqual(noAddress);
  });
});
