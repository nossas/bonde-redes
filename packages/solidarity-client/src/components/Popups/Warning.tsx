import React from "react";
import { Header, Text, Link } from "bonde-components";
import { StyledLink } from "./styles";

export default function Warning({
  name,
  onClose,
  isEnabled,
  id
}: {
  name: string;
  id: number;
  onClose: () => void;
  isEnabled: boolean;
}) {
  return isEnabled ? (
    <>
      <Header.h2>Ops!</Header.h2>
      <Text align="center">{"Telefone Inválido ):"}</Text>
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
  ) : null;
}
