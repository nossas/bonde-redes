import React from "react";
import { Header, Text, Button, Link } from "bonde-components";
import { StyledLink } from "./styles";

export default function Success({
  individualName,
  volunteerName,
  onClose,
  link,
  isEnabled,
  ticketId
}: {
  individualName: string;
  volunteerName: string;
  onClose: () => void;
  link: () => string | undefined;
  isEnabled: boolean;
  ticketId: number;
}) {
  return isEnabled ? (
    <>
      <Header.h2 align="center">Encaminhamento Realizado</Header.h2>
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
        style={{ textDecoration: "none" }}
        href={link()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button>enviar whats para voluntária</Button>
      </a>
      <StyledLink onClick={onClose}>fazer nova busca</StyledLink>
    </>
  ) : null;
}
