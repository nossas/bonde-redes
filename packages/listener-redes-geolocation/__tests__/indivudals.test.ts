import { geolocation } from '../src/individuals';

describe('geolocation function', () => {

  // beforeAll(async () => {
  //   const p: Promise<string> = convertCepToAddressWithGoogleApi();
  //   hello = await p;
  // });

  // Assert if setTimeout was called properly
  it('google maps api key present', async () => {

    expect(await geolocation({
      "data": {
        rede_individuals: [
          {}
        ],
      }
    })).toEqual({
      "error": 1
    })
  });
});
