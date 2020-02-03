import React from 'react';
import GlobalContext from '../../../context';
import { useStateLink } from '@hookstate/core';

const UserInfo: React.FC = () => {
  const { map: { popupInfoRef } } = GlobalContext
  const popupInfo = useStateLink(popupInfoRef)

  const {
    name,
    email,
    status_inscricao,
    data_de_inscricao_no_bonde,
    user_id,
    condition,
  } = popupInfo.value

  return (
    <div>
      <div>
        <h4>{name}</h4>
        <br />
        <span>{`Email: ${email}`}</span>
        <br />
        <span>{`Status da mulher: ${condition || '-'}`}</span>
        <br />
        <span>{`Status da inscrição: ${status_inscricao || '-'}`}</span>
        <br />
        <span>{`Data de inscrição no BONDE: ${data_de_inscricao_no_bonde || '-'}`}</span>
        <br />
        <span>Link no Zendesk:</span>
        {' '}
        <a href={`https://mapadoacolhimento.zendesk.com/agent/#/users/${user_id}`} target="_blank" rel="noopener noreferrer">{user_id}</a>
      </div>
    </div>
  )
}

export default UserInfo
