import React from "react";
import { Title, Text, Button, Link } from "bonde-styleguide";
import { Loading } from "bonde-components";
import { If } from "../If";
import {
  StyledFlexbox,
  StyledModal,
  StyledLink,
  ErrorWrapper,
  Box
} from "./styles";

type Props = {
  confirm: {
    onClose: Function;
    onSubmit: Function;
    isEnabled: boolean;
  };
  success: {
    onClose: Function;
    link: () => string;
    isEnabled: boolean;
    ticketId: number;
  };
  error: {
    onClose: Function;
    onSubmit: Function;
    isEnabled: boolean;
    message: string;
  };
  isOpen: boolean;
  volunteerName: string;
  individualName: string;
  onClose: Function;
  isLoading?: boolean;
  warning: {
    isEnabled: boolean;
    name: string;
    id: number | string;
  };
};

const Popup = ({
  confirm,
  success,
  error,
  warning,
  isOpen,
  onClose,
  volunteerName,
  individualName,
  isLoading
}: Props) => {
  return (
    <StyledModal opened={isOpen} onClose={onClose} width={30}>
      <StyledFlexbox middle vertical spacing="evenly">
        <If condition={isLoading}>
          <Loading />
        </If>
        <If condition={confirm.isEnabled}>
          {Confirm({ ...confirm, volunteerName, individualName })}
        </If>
        <If condition={success.isEnabled}>
          {Success({ ...success, volunteerName, individualName })}
        </If>
        <If condition={error.isEnabled}>
          {Error({ ...error, volunteerName, individualName })}
        </If>
        <If condition={warning.isEnabled}>
          {Warning({ ...warning, onClose })}
        </If>
      </StyledFlexbox>
    </StyledModal>
  );
};

const Warning = ({
  name,
  id,
  onClose
}: {
  name: string;
  id: string | number;
  onClose: Function;
}) => (
  <>
    <Title.H2>Ops!</Title.H2>
    <Text align="center">Telefone Inválido ):</Text>
    <Text align="center">
      A voluntária{" "}
      <Link
        href={`https://mapadoacolhimento.zendesk.com/agent/users/${id}/requested_tickets`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </Link>{" "}
      não possui número de Whastapp
    </Text>
    <StyledLink onClick={onClose}>fazer nova busca</StyledLink>
  </>
);

const Confirm = ({
  individualName,
  volunteerName,
  onClose,
  onSubmit
}: {
  individualName: string;
  volunteerName: string;
  onClose: Function;
  onSubmit: Function;
}) => (
  <>
    <Title.H2>Confirma?</Title.H2>
    <Text align="center">
      {individualName} será encaminhada para {volunteerName}
    </Text>
    <Button onClick={onSubmit}>confirmar encaminhamento</Button>
    <StyledLink onClick={onClose}>voltar para o match</StyledLink>
  </>
);

const Success = ({
  individualName,
  volunteerName,
  onClose,
  link,
  ticketId
}: {
  individualName: string;
  volunteerName: string;
  onClose: Function;
  link: () => string;
  ticketId: string | number;
}) => (
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
    <a href={link()} target="_blank" rel="noopener noreferrer">
      <Button>enviar whats para voluntária</Button>
    </a>
    <StyledLink onClick={onClose}>fazer nova busca</StyledLink>
  </>
);

const Error = ({
  individualName,
  volunteerName,
  onClose,
  onSubmit,
  message
}: {
  individualName: string;
  volunteerName: string;
  onClose: Function;
  onSubmit: Function;
  message: string;
}) => (
  <ErrorWrapper vertical>
    <Title.H2>Ops!</Title.H2>
    <Text align="center">
      Encontramos um erro e {individualName} não pôde ser encaminhada para{" "}
      {volunteerName}
    </Text>
    <Text align="center">
      Clique abaixo para tentar outra vez. Se o erro persistir, comunique o time
      de tech.
    </Text>
    <Box middle>
      <Text>{message}</Text>
    </Box>
    <Button onClick={onSubmit}>encaminhar novamente</Button>
    <StyledLink onClick={onClose}>voltar para o match</StyledLink>
  </ErrorWrapper>
);

Popup.defaultProps = {
  isOpen: false
};

export default Popup;
