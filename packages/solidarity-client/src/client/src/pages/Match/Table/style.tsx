import styled from "styled-components";

export const FullWidth = styled.div`
  width: 100%;
  padding: 40px;
`;
export const Spacing = styled.div`
  margin-bottom: ${(props: { margin: string}) => props.margin}px;
`;
export const WrapButtons = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-evenly;
`
