import React from "react";
import { StyledFlexbox, StyledModal } from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  volunteerName: string;
  individualName: string;
  onSubmit: any;
  children;
};

const Popup = ({
  isOpen,
  onClose,
  volunteerName,
  individualName,
  onSubmit,
  children
}: Props) => (
  <StyledModal opened={isOpen} onClose={onClose} width={30}>
    <StyledFlexbox middle vertical spacing="evenly">
      {children({
        volunteerName,
        individualName,
        onClose,
        onSubmit
      })}
    </StyledFlexbox>
  </StyledModal>
);

Popup.defaultProps = {
  isOpen: false
};

export default Popup;
