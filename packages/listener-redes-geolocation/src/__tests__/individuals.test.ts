import { 
  mutationUpdateCoordinates, 
  validateMutationRes, 
  schema,
  // geolocation
} from "../individuals";

describe("Individuals", () => {
  describe("Check step by step funcs in geolocation func", () => {
    // it("Validate super geolocation function", async () => {
    //   expect(
    //     await geolocation({
    //       data: {
    //         rede_individuals: [
    //           {
    //             "id": 25,
    //             "zipcode": "01222001",
    //             "created_at": "2020-04-02T16:01:02.717461",
    //           }
    //         ]
    //       }
    //     }
    //     )).toEqual({
    //       id: 25,
    //       coordinates:{latitude:"-23.5455809",longitude:"-46.6473778"},
    //       address: "Vila Buarque, São Paulo - State of São Paulo, 01222-001, Brazil",
    //       state: "SP",
    //       city: "São Paulo"
    //     })
    // })
    it("When validating input for mutation, it returns a valid object", async () => {
      expect(
        await validateMutationRes(
          schema,
          {
            id:25,
            coordinates:{latitude:"-23.5455809",longitude:"-46.6473778"},
            address: "Vila Buarque, São Paulo - State of São Paulo, 01222-001, Brazil",
            state: "SP",
            city: "São Paulo"
          }
        )
      ).toEqual({
        id: 25,
        coordinates:{latitude:"-23.5455809",longitude:"-46.6473778"},
        address: "Vila Buarque, São Paulo - State of São Paulo, 01222-001, Brazil",
        state: "SP",
        city: "São Paulo"
      })
    })
    it("When validating incorrect input, it returns an error", async () => {
      expect(
        await validateMutationRes(
          schema,
          {
            id:25,
            coordinates:{latitude:"-23.5455809",longitude:"-46.6473778"},
            address: "Vila Buarque, São Paulo - State of São Paulo, 01222-001, Brazil",
            state: "SP"
          }
        )
      ).toEqual(false)
    })
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
      ).toEqual([{
        id: 19,
        coordinates: {
          latitude: "-23.0158877",
          longitude: "-45.53779979999999"
        },
        address: "Jardim Ana Emilia, Taubaté - SP, 12070-620, Brazil",
        state: "SP",
        city: "Taubaté",
        __typename: "rede_individuals"
      }])
    });
  });
});
