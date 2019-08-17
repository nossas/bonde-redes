Esse pacote faz o log de qualquer requisição POST do tipo JSON, no banco de dados `webhook_logs`, na coluna `data`.

A url da API do Hasura deve ser definida através da variável de ambiente `HASURA_API_URL`.

O nome do serviço deve ser colocado no caminho da requisição `/<nome do serviço>`. Essa informação também será salva no banco de dados na coluna `service_name` junto com o JSON recebido.
