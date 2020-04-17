# BONDE-CLIENT-REDES

Based on `create-react-app`

This client provides a dynamic interface to manage REDES in BONDE's ecosystem.

## Environment

- `HOST=redes.bonde.devel`
- `PORT=4000`
- `REACT_APP_ADMIN_URL=`

### What you need to execute `client-redes`

- Add `redes.bonde.devel` to your `/etc/hosts` file
- A viable instance of **bonde-cross-storage** running locally
  - To achieve this you'll have to go to [bonde-install](https://github.com/nossas/bonde-install) and execute an inital setup
  - To make sure `cross-storage` is working, execute:
    - `docker-compose -f docker-compose.clients.yml up -d cross-storage`, and set up a persistent log in the console:
    - `docker-compose -f docker-compose.clients.yml logs -f cross-storage`
- Get a valid JWToken to access BONDE
  - Go to [bonde-auth](https://github.com/nossas/bonde-install) and execute the inital setup to run `bonde-accounts-client`
  - If the page remained blank, check the browser logs to see if there's no `cross-storage` errors. If there is, check the `cross-storage` logs you left executing in the terminal.
  - If you successfully ran the auth client, let's go back to `client-redes`
- Execute the client with `pnpm --filter client-redes run dev`, and you'll be redirected to `accounts.bonde.devel`.
- With a sucessful authentication, you'll be redirected to `redes.bonde.devel:4000` and start to hack!
