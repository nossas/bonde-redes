import React from 'react'
import { Title, Text, Button, Spacing } from "bonde-styleguide";
import { StyledLink, } from "./styles";

export default function Success ({
  individualName,
  volunteerName,
  onClose,
  link,
  isEnabled
}: {
  individualName: string;
  volunteerName: string;
  onClose: () => void;
  link: {
    volunteer: () => string | undefined;
    individual: () => string | undefined;
  };
  isEnabled: boolean
}) {
  return isEnabled
    ? (
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
    ) : null;
}