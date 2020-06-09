import { Modal, Flexbox2 as Flexbox, Link } from "bonde-styleguide";
import styled from "styled-components";

export const StyledFlexbox = styled(Flexbox)`
  min-height: 250px;
  max-height: 400px;
`;

export const StyledModal = styled(Modal)`
  overflow: hidden;
`;

export const StyledLink = styled(Link)`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

export const Box = styled(Flexbox)`
  padding: 15px;
  background-color: #eeeeee;
`;

export const ErrorWrapper = styled(Flexbox)`
  @media (min-width: 576px) {
    min-height: 400px;
  }
  justify-content: space-evenly;
  align-items: center;
`;
