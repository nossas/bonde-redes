import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "bonde-styleguide";
import useAppLogic from "../app-logic";
import { Individual } from "../graphql/FetchIndividuals";

const BtnWarning = styled(Button)`
  border-color: ${(props): string => (props.disabled ? "unset" : "#EE0090")}
  color: ${(props): string => (props.disabled ? "#fff" : "#EE0090")}
`;

const Connect = ({ individual }: { individual: Individual }) => {
  const { volunteer, setIndividual, setPopup } = useAppLogic();

  const onClick = (data: Individual): void => {
    // TODO: Tratar caso em que a usuária não tem user_id
    setIndividual(data);
    return setPopup({
      confirm: true,
      wrapper: true
    });
  };

  return (
    <BtnWarning
      light
      onClick={(): void => onClick(individual)}
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
