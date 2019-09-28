Definição do fluxo, novamente.

Quando há uma alteração no TICKET, o webhooks-solidarity-count é informado.
Ele atualiza a criação do ticket no banco.
O webhooks-solidarity-match vai funcionar com o disparo de um gatilho de update no HASURA, causado pelo webhooks-solidarity-count.

Condições:
- Prossegue para procedimento de match apenas caso o ticket seja de uma voluntária.

Informações necessárias:
Olhar o dono do ticket no banco, verificar coordenadas dele.
Verificar se há outras pessoas próximas num raio de 20km.
Verificar quantidade de atendimentos disponíveis, envaminhamentos nos últimos 30 dias e quantidade de atendimentos atuais.
Se tudo passar, executar procedimento de match.

Procedimento de match, deixar isso com o webhooks-solidarity-match.
