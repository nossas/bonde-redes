import styled from "styled-components";
import { Button } from "bonde-components";

export const StyledButton = styled(Button)`
  && {
    border: none;
    padding: 0;
    border-color: transparent;
  }
`;

export const WrapLabel = styled.label`
  display: flex;
  align-items: center;
  & > input {
    margin-right: 5px;
  }
`;

export const Wrap = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
`;
