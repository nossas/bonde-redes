import React from "react";
import { Loading as Loader, Text } from "bonde-components";
import styled from "styled-components";

const Wrap = styled.div`
  height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  & > p {
    padding-top: 15px;
  }
`;

const Loading = ({ text }: { text: string }) => (
  <Wrap>
    <Loader />
    <Text bold>{text}</Text>
  </Wrap>
);

export default Loading;
