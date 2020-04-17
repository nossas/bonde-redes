import styled from "styled-components";
import { Button } from "bonde-components";

export const Wrap = styled.div`
  @media (min-width: 768px) {
    width: 90%;
  }
`;

export const StyledButton = styled(Button)`
  && {
    border: none;
    padding: 0;
    border-color: transparent;
  }
`;
