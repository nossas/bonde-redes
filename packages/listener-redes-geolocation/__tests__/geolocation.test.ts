import { convertCepToAddressWithGoogleApi } from '../src/geolocation';

describe('convertCepToAddressWithGoogleApi function', () => {

  // beforeAll(async () => {
  //   const p: Promise<string> = convertCepToAddressWithGoogleApi();
  //   hello = await p;
  // });

  // Assert if setTimeout was called properly
  it('google maps api key present', async () => {

    expect(await convertCepToAddressWithGoogleApi('04140040')).toEqual({
      "error": 1
    })
  });
});
