import { composeUser } from "../.";
import widgets from "../../../form_entries_mapping";
import data, { geolocation } from "../__mocks__";

describe("Test if user is build correctly", () => {
  describe("volunteer is created with expected output", () => {
    // Therapists
    const getGeolocation = jest.fn().mockResolvedValue(geolocation);
    test('entry from widget "2760"', async () => {
      const {
        2760: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
    test('entry from widget "16835"', async () => {
      const {
        16835: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
    test('entry from widget "17628"', async () => {
      const {
        17628: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });

    // Lawyers
    test('entry from widget "8190"', async () => {
      const {
        8190: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
    test('entry from widget "16838"', async () => {
      const {
        16838: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
    test('entry from widget "17633"', async () => {
      const {
        17633: { cache, results },
      } = data;
      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });

    // MSR's
    test('entries from widget "16850"', async () => {
      const {
        16850: { cache, results },
      } = data;

      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
    test('entries from widget "3297"', async () => {
      const {
        3297: { cache, results },
      } = data;

      const user = await composeUser(cache, widgets, getGeolocation);
      Promise.all(user).then((u) => {
        expect(u).toStrictEqual(results);
      });
    });
  });
});
