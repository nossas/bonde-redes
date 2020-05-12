import { getSolidarityUsers, getSolidarityTickets } from "../hasura";
import { isValidTicket, getUserFromTicket } from "../utils";

const main = async (_req, res, _next) => {
  const locationUsers = await getSolidarityUsers({
    query: `query {
      solidarity_users(
        where: {
          longitude: {_is_null: false},
          latitude: {_is_null: false}
        }
      ) {
        user_id
        latitude
        longitude
        organization_id
        id
      }
    }`
  });

  const locationUsersTicket = await getSolidarityTickets({
    query: `query {
      solidarity_tickets(
        where: {
          requester_id: {_is_null: false},
          status: {_is_null: false},
        }
      ) {
        requester_id
        status
        subject
        id
      }
    }`
  });

  const hasValidLatLng = ({ lat, lng }) =>
    lat <= 90 && lat >= -90 && lng <= 190 && lng >= -180;

  const ticketsWithUser = locationUsersTicket
    .filter(ticket => isValidTicket(locationUsers, ticket))
    .map(ticket => {
      const user = getUserFromTicket(locationUsers, ticket)[0];
      return { ...ticket, ...user };
    })
    .filter(user =>
      hasValidLatLng({
        lat: Number(user.latitude),
        lng: Number(user.longitude)
      })
    );

  res.json(ticketsWithUser);
};

export default main;
