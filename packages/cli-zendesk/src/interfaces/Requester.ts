export interface Requester {
  id: number
  atendimentos_em_andamento_calculado_: number
  atendimentos_concludos_calculado_: number
  encaminhamentos_realizados_calculado_: number
}

export interface Requesters {
  [s: number]: Requester
}
