import React from 'react';
import { Ticket } from '../../../models/table-data'

const dicioUser = {
  360269610652: "Advogada",
  360273031591: "MSR",
  360282119532: "Psicóloga"
}

const getUserType = (id: number) => dicioUser[id]

const UserInfo: React.FC<Ticket> = ({ name, email, data_de_inscricao_no_bonde, user_id, organization_id, condition }) => {
  return (
    <div>
      <div>
        <h4>{name}</h4>
        <br />
        <span>{`Email: ${email}`}</span>
        <br />
        <span>{`Status da mulher: ${condition}`}</span>
        <br />
        <span>{`Tipo de usuária: ${getUserType(organization_id)}`}</span>
        <br />
        <span>{`Data de inscrição no BONDE: ${data_de_inscricao_no_bonde}`}</span>
        <br />
        <span>Link no Zendesk:</span>
        {' '}
        <a href={`https://mapadoacolhimento.zendesk.com/agent/#/users/${user_id}`} target="_blank" rel="noopener noreferrer">{user_id}</a>
      </div>
    </div>
  )
}

export default UserInfo
