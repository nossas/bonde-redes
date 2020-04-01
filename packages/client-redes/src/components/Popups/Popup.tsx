import React from "react";
import { Title, Text, Button, Loading, Spacing } from "bonde-styleguide";

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
    isEnabled: boolean;
  };
  success: {
    link: {
      individual: () => string | undefined;
      volunteer: () => string | undefined;
    };
    isEnabled: boolean;
  };
  error: {
    isEnabled: boolean;
    message: string;
  };
  warning: {
    isEnabled: true;
    id: number;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
  volunteerName: string;
  individualName: string;
  isLoading: boolean;
  onSubmit: any;
};

const Warning = ({
  name,
  id,
  onClose
}: {
  name: string;
  id: number;
  onClose: () => void;
}) => (
  <>
    <Title.H2>Ops!</Title.H2>
    <Text align="center">{"Telefone Inválido ):"}</Text>
    <Text align="center">
      A voluntária {name} não possui número de Whastapp
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
  onClose: () => void;
  onSubmit: Promise<unknown>;
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
  link
}: {
  individualName: string;
  volunteerName: string;
  onClose: () => void;
  link: {
    volunteer: () => string | undefined;
    individual: () => string | undefined;
  };
}) => (
  <>
    <Title.H2 align="center">Encaminhamento Realizado</Title.H2>
    <Text align="center">
      EBA! {individualName} foi encaminhada para {volunteerName}.
    </Text>
    <Spacing margin={{ top: 20, bottom: 20 }}>
      <a href={link.volunteer()} target="_blank" rel="noopener noreferrer">
        <Button>enviar whats para voluntária</Button>
      </a>
    </Spacing>
    <Spacing margin={{ bottom: 20 }}>
      <a href={link.individual()} target="_blank" rel="noopener noreferrer">
        <Button>enviar whats para psr</Button>
      </a>
    </Spacing>
    <StyledLink onClick={onClose}>voltar à lista de voluntárias</StyledLink>
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
  onClose: () => void;
  onSubmit: Promise<unknown>;
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

const Popup = ({
  confirm,
  success,
  error,
  warning,
  isOpen,
  onClose,
  volunteerName,
  individualName,
  isLoading,
  onSubmit
}: Props) => {
  return (
    <StyledModal opened={isOpen} onClose={onClose} width={30}>
      <StyledFlexbox middle vertical spacing="evenly">
        <If condition={isLoading}>
          <Loading />
        </If>
        <If condition={confirm.isEnabled}>
          {Confirm({
            ...confirm,
            volunteerName,
            individualName,
            onClose,
            onSubmit
          })}
        </If>
        <If condition={success.isEnabled}>
          {Success({ ...success, volunteerName, individualName, onClose })}
        </If>
        <If condition={error.isEnabled}>
          {Error({
            ...error,
            volunteerName,
            individualName,
            onClose,
            onSubmit
          })}
        </If>
        <If condition={warning.isEnabled}>
          {Warning({ ...warning, onClose })}
        </If>
      </StyledFlexbox>
    </StyledModal>
  );
};

Popup.defaultProps = {
  isOpen: false
};

export default Popup;
