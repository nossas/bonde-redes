Este pacote é um programa em linha de comando que quando executado realiza a integração de todos os tickets do zendesk para o banco de dados através de requisições em graphql.

```
Options:
  -m, --mode <mode>  Required. Selects the operation mode. It can be "ticket" or "user"
  -h, --help         output usage information
```

As variáveis de ambiente que precisam ser configuradas estão descritas a seguir:

- ZENDESK_API_URL - url da api do zendesk
- ZENDESK_API_TOKEN - token de autenticação do zendesk
- ZENDESK_API_USER - email do usuário do zendesk pelo qual será feita a autenticação, concatenado com '/token' no fim. EX: email@example.com/token
- GOOGLE_MAPS_API_KEY - token de autenticação do GOOGLE API para realização de chamadas à api do google maps
- HASURA_API_URL - endpoint da api do HASURA, onde serão salvos os tickets
- X_HASURA_ADMIN_SECRET - chave de segurança de administrador do hasura para autenticação
- COMMUNITY_ID - id da comunidade do bonde, esse valor será salvo junto ao ticket dentro do bonde para facilitar na análise dos dados posteriormente
