import React from "react";
import { Title, Text } from "bonde-styleguide";
import { StyledLink } from "./styles";

export default function Warning({
  name,
  onClose,
  isEnabled
}: {
  name: string;
  id: number;
  onClose: () => void;
  isEnabled: boolean;
}) {
  return isEnabled ? (
    <>
      <Title.H2>Ops!</Title.H2>
      <Text align="center">{"Telefone Inválido ):"}</Text>
      <Text align="center">
        A voluntária {name} não possui número de Whastapp
      </Text>
      <StyledLink onClick={onClose}>fazer nova busca</StyledLink>
    </>
  ) : null;
}
