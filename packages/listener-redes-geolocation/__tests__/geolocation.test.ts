import { convertCepToAddressWithGoogleApi } from '../src/geolocation';

describe('convertCepToAddressWithGoogleApi function', () => {

  beforeEach(() => {
    process.env = Object.assign(process.env, {
      HASURA_SECRET: '1111111',
      GOOGLE_MAPS_API_KEY: '222222',
     });
  });

  // Assert if setTimeout was called properly
  it('google maps api key present', async () => {

    expect(await convertCepToAddressWithGoogleApi({ zipcode:'04140040', id: 1, created_at: '2020-12-10'})).toEqual({
      "error": 1
    })
  });
});
