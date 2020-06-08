import { Flexbox2 as Flexbox } from "bonde-styleguide";
import { Button } from "bonde-components";
import styled from "styled-components";

export const Spacing = styled.div`
  margin-bottom: ${(props: { margin: string }) => props.margin}px;
`;
export const WrapButtons = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-evenly;
`;

export const StyledFlexbox = styled(Flexbox)`
  align-items: center;
  margin-bottom: 25px;
`;

export const StyledButton = styled(Button)`
  && {
    border: none;
    padding: 0;
    border-color: transparent;
    margin-bottom: 15px;
  }
`;
