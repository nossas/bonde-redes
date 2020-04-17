import React from "react";
import { Title, Text, Button } from "bonde-styleguide";
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
      <Title.H2>Confirma?</Title.H2>
      <Text align="center">
        {individualName} será encaminhada para {volunteerName}
      </Text>
      <Button onClick={onSubmit}>confirmar encaminhamento</Button>
      <StyledLink onClick={onClose}>voltar para o match</StyledLink>
    </>
  ) : null;
}
