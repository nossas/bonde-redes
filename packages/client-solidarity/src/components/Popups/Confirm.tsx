import React from "react";
import { Header, Text, Button } from "bonde-components";
import { StyledLink } from "./styles";

export default function Confirm({
  individualName,
  volunteerName,
  onClose,
  onSubmit,
  isEnabled
}: {
  individualName: string;
  volunteerName: string;
  onClose: () => void;
  onSubmit: Promise<unknown>;
  isEnabled: boolean;
}) {
  return isEnabled ? (
    <>
      <Header.h2>Confirma?</Header.h2>
      <Text align="center">
        {individualName} será encaminhada para {volunteerName}
      </Text>
      <Button onClick={onSubmit}>confirmar encaminhamento</Button>
      <StyledLink onClick={onClose}>voltar para o match</StyledLink>
    </>
  ) : null;
}
