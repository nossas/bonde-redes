import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "bonde-styleguide";
import { useStoreActions } from "easy-peasy";
import useAppLogic from "../app-logic";

const BtnWarning = styled(Button)`
  border-color: ${props => (props.disabled ? "unset" : "#EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
`;

const Connect = ({ id }) => {
  const setIndividual = useStoreActions(
    actions => actions.individual.setIndividual
  );
  const setPopup = useStoreActions(actions => actions.popups.setPopup);

  const { volunteer, getUserData, tableData } = useAppLogic();

  const onClick = () => {
    // TODO: Tratar caso em que a usuária não tem user_id
    const user = getUserData({
      user: id,
      data: tableData,
      filterBy: "id"
    });
    setIndividual(user);
    setPopup({
      confirm: true,
      wrapper: true
    });
  };

  return (
    <BtnWarning
      light
      onClick={onClick}
      disabled={volunteer && volunteer.email === ""}
    >
      Encaminhar
    </BtnWarning>
  );
};

Connect.propTypes = {
  id: PropTypes.number.isRequired
};

export default Connect;
