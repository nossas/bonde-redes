import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "bonde-styleguide";
import useAppLogic from '../app-logic'

const BtnWarning = styled(Button)`
  border-color: ${props => (props.disabled ? "unset" : "#EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
`;

const Connect = ({ individual }) => {
  const {
    volunteer,
    setIndividual,
    setPopup
  } = useAppLogic()

  const onClick = (data) => {
    // TODO: Tratar caso em que a usuária não tem user_id
    setIndividual(data);
    setPopup({
      confirm: true,
      wrapper: true
    });
  };

  return (
    <BtnWarning
      light
      onClick={() => onClick(individual)}
      disabled={volunteer && volunteer.email === ""}
    >
      Encaminhar
    </BtnWarning>
  );
};

Connect.propTypes = {
  individual: PropTypes.object.isRequired
};

export default Connect;
