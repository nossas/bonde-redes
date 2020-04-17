import React from "react";
import { Text } from "bonde-styleguide";
import styled from "styled-components";

const Wrap = styled.div`
  display: grid;
  align-items: center;
  height: 100%;
`;

type valueString = {
  value: string;
};

export const TextHeader = ({ value }: valueString): JSX.Element => (
  <Text fontSize={13} fontWeight={600}>
    {value.toUpperCase()}
  </Text>
);

export const TextCol = ({ value }: valueString): React.ReactNode => (
  <Wrap>
    <Text color="#000">{value}</Text>
  </Wrap>
);

export const DateText = ({ value }: valueString): React.ReactNode => {
  if (!value) {
    return "-";
  }
  const data = new Date(value);
  return <Wrap>{data.toLocaleDateString("pt-BR")}</Wrap>;
};
