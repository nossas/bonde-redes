# WEBHOOKS_COUNT

Esse pacote faz a sincronização completa do do ticket em tempo real, fazendo a contagem dos tickets e atualizando os usuários no zendesk, realizando o match entre voluntárias e MSRs sempre que ouver uma mudança de status em um ticket e deixando o banco de dados sempre em sincronização com os tickets modificados.

Esse webhook é disparado quando qualquer ticket do Zendesk é atualizado. Ele foi configurado no Zendesk na área das APIs.

As seguintes variáveis de ambiente devem ser configuradas:

- ZENDESK_API_URL - url da api do zendesk
- ZENDESK_API_TOKEN - token de autenticação do zendesk
- ZENDESK_API_USER - email do usuário do zendesk pelo qual será feita a autenticação, concatenado com '/token' no fim. EX: email@example.com/token
- PORT=
- ZENDESK_ORGANIZATIONS = objeto JSON, mapeando as organizações `ADVOGADA`, `MSR` e `PSICOLOGA` com os seus respectivos ids, seguindo o seguinte formato:

```json
{"ADVOGADA":"","MSR":"","PSICOLOGA":""}
```

- GOOGLE_MAPS_API_KEY - token de autenticação do GOOGLE API para realização de chamadas à api do google maps

- WIDGET_IDS - objeto JSON, mapeando o id dos form_entries da comunidade do mapa do acolhimento do bonde, para que seja possível filtrar os form_entries na hora de buscar a data original de inscrição do bonde, seguindo o seguinte formato:

```json
{"ADVOGADA": "", "PSICÓLOGA": ""}
```

- HASURA_API_URL - endpoint da api do HASURA, onde serão salvos os tickets
- X_HASURA_ADMIN_SECRET - chave de segurança de administrador do hasura para autenticação
