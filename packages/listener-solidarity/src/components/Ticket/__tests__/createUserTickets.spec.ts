import { composeTickets } from "../.";
import data from "../__mocks__";

describe("Test if ticket is building correctly", () => {
  test("msr ticket is created with expected output", async () => {
    const createTickets = await composeTickets(data.users.individuals);
    expect(createTickets).toStrictEqual(data.results);
  });
  test("volunteer ticket is not created", async () => {
    const createTicketsVolunteers = await composeTickets(data.users.volunteers);
    expect(createTicketsVolunteers).toStrictEqual([]);
  });
});
