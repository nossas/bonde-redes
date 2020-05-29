# LISTENER SOLIDARITY

This listener listen's to some specific widget_id's from the form_entries table. And it's called if the column `rede_syncronized` is `false`.

These are the widgets separared by user types:

- Therapists
  - 2760
  - 16835
  - 17628

- Lawyers
  - 8190
  - 16838
  - 17633

- MSR
  - 3297
  - 16850


## User

When it's called, the integration starts by creating or updating the user at Zendesk, then saving it in Hasura.

If the user already existed in Zendesk - this is determined by their e-mail and external_id (form entry id) - the user will be updated in Zendesk and the same `user_id` will be returned, thus Hasura will also update this in the database, because one of the unique keys from the `solidarity_users` table is the column `user_id`. 

If all of these processes are correct, the form entry row from `form_entries` table will also be updated at the `rede_syncronized` column, now indicating that it's true. 

## Ticket

If the user was successfully created in Zendesk then their tickets will also be created. **Only MSR tickets are created in this integration**, volunteer tickets are created in another service.

If a user asks for two types of volunteers, then two tickets will be created, if it only asks for one, then only one will be created according to what she filled in the form. 

A new ticket will always be created, but there is a check to see if a similar ticket to the new one created already exists. The criteria for this is: 
  - the older ticket has the same type of request ("psicológico" or "jurídico")
  - the older ticket has a status "new"
If the older ticket meets these criteria, it's status will be altered to "closed".