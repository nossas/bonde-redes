import React from "react";
import { Title, Text, Button } from "bonde-styleguide";
import { StyledLink, ErrorWrapper, Box } from "./styles";

export default function Error({
  individualName,
  volunteerName,
  onClose,
  onSubmit,
  message,
  isEnabled
}: {
  individualName: string;
  volunteerName: string;
  onClose: () => void;
  onSubmit: Promise<unknown>;
  message: string;
  isEnabled: boolean;
}) {
  return isEnabled ? (
    <ErrorWrapper vertical>
      <Title.H2>Ops!</Title.H2>
      <Text align="center">
        Encontramos um erro e {individualName} não pôde ser encaminhada para{" "}
        {volunteerName}
      </Text>
      <Text align="center">
        Clique abaixo para tentar outra vez. Se o erro persistir, comunique o
        time de tech.
      </Text>
      <Box middle>
        <Text>{message}</Text>
      </Box>
      <Button onClick={onSubmit}>encaminhar novamente</Button>
      <StyledLink onClick={onClose}>voltar para o match</StyledLink>
    </ErrorWrapper>
  ) : null;
}
