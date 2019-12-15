import React from 'react'
import {
  Modal,
  Flexbox2 as Flexbox,
  Title,
  Text,
  Button,
  Link
} from 'bonde-styleguide'
import styled from 'styled-components'
import { If } from './If'

const StyledFlexbox = styled(Flexbox)`
  min-height: 250px;  
`

const StyledModal = styled(Modal)`
  overflow: hidden;
`

const Popup = ({ confirm, success, error, isOpen, onClose, volunteerName, individualName }) => {
  return (
    <StyledModal
      opened={isOpen}
      onClose={onClose}
      width={20}
    >
      <StyledFlexbox middle vertical spacing="evenly">
        <If condition={confirm.isEnabled}>
          {Confirm({ ...confirm, volunteerName, individualName })}
        </If>
        <If condition={success.isEnabled}>
          {Success({ ...success, volunteerName, individualName })}
        </If>
        <If condition={error.isEnabled}>
          {Error({ ...error, volunteerName, individualName })}
        </If>
      </StyledFlexbox>
  </StyledModal>
  )
}

const StyledLink = styled(Link)`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`

const Confirm = ({ individualName, volunteerName, onClose, onSubmit }) => (
  <>
    <Title.H2>Confirma?</Title.H2>
    <Text align="center">
      {individualName} será encaminhada para {volunteerName}
    </Text>
    <Button onClick={onSubmit}>confirmar encaminhamento</Button>
    <StyledLink onClick={onClose}>voltar para o match</StyledLink>
  </>
)

const Success = ({ individualName, volunteerName, onClose, link, ticketId }) => (
  <>
    <Title.H2 align="center">Encaminhamento Realizado</Title.H2>
    <Text align="center">
      EBA! {individualName} foi encaminhada para {volunteerName}.
    </Text>
    <Link
      href={`https://mapadoacolhimento.zendesk.com/agent/tickets/${ticketId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Acesse o ticket do match
    </Link>
    <a
      href={link()}
      target="_blank"
      rel="noopener noreferrer"
      alt="Enviar mensagem no Whatsapp"
    >
      <Button>enviar whats para voluntária</Button>
    </a>
    <StyledLink onClick={onClose}>fazer nova busca</StyledLink>
  </>
)

const Box = styled(Flexbox)`
  padding: 15px;
  background-color: #eeeeee;
`

const ErrorWrapper = styled(Flexbox)`
  @media(min-width: 576px) { min-height: 400px; }
  justify-content: space-evenly;
  align-items: center;
`

const Error = ({ individualName, volunteerName, onClose, onSubmit, message }) => (
  <ErrorWrapper vertical>
    <Title.H2>Ops!</Title.H2>
    <Text align="center">
      Encontramos um erro e {individualName} não pôde ser encaminhada para {volunteerName}
    </Text>
    <Text align="center">Clique abaixo para tentar outra vez. Se o erro persistir, comunique o time de tech.</Text>
    <Box middle>
      <Text>{message}</Text>
    </Box>
    <Button onClick={onSubmit}>encaminhar novamente</Button>
    <StyledLink onClick={onClose}>voltar para o match</StyledLink>
  </ErrorWrapper>
)

export default Popup