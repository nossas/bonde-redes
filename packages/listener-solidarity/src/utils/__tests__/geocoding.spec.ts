import { geolocation } from "../geocoding";
import faker from "faker/locale/pt_BR";

describe("geolocation tests", () => {
  const validOutput = {
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    address: faker.address.streetAddress(true),
    state: faker.address.state(true),
    city: faker.address.city(),
    cep: faker.address.zipCode(),
  };
  const mapsSuccess = {
    results: [
      {
        geometry: {
          location: {
            lat: Number(parseFloat(validOutput.latitude)),
            lng: Number(parseFloat(validOutput.longitude)),
          },
        },
        formatted_address: validOutput.address,
        address_components: [
          {
            long_name: validOutput.cep,
            short_name: validOutput.cep,
            types: ["postal_code"],
          },
          {
            long_name: validOutput.city,
            short_name: validOutput.city,
            types: ["administrative_area_level_2", "political"],
          },
          {
            long_name: validOutput.state,
            short_name: validOutput.state,
            types: ["administrative_area_level_1", "political"],
          },
        ],
      },
    ],
    status: "OK",
  };

  const email = faker.internet.email();
  const invalidOutput = {
    latitude: "ZERO_RESULTS",
    longitude: "ZERO_RESULTS",
    address: `Endereço não encontrado - ${validOutput.address}`,
    state: "ZERO_RESULTS",
    city: "ZERO_RESULTS",
    cep: "ZERO_RESULTS",
  };

  it("should return valid output if there are results", () => {
    const success = geolocation(email, validOutput.address, mapsSuccess);
    expect(success).toStrictEqual(validOutput);
  });

  it("should return invalid output if ZERO_RESULTS", () => {
    const mapsFailure = {
      results: [],
      status: "ZERO_RESULTS",
    };
    const failure = geolocation(email, validOutput.address, mapsFailure);
    expect(failure).toStrictEqual(invalidOutput);
  });

  it("should return invalid output if there was an error with Google Maps API", () => {
    const failure = geolocation(email, validOutput.address, undefined);
    expect(failure).toStrictEqual(invalidOutput);
  });
});
