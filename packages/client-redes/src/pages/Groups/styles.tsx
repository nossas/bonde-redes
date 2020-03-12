import styled from "styled-components";
import { Button } from "bonde-styleguide";

export const Wrap = styled.div`
  @media (min-width: 768px) {
    width: 90%;
  }
  margin: 20px 0;

  .ReactTable {
    border: 1px solid #c7c7c7;

    .rt-thead {
      .rt-th,
      .rt-td {
        padding: 5px 5px;
      }
    }
    .rt-tbody {
      .rt-th,
      .rt-td {
        padding: 10px 5px;
        margin: auto;
      }
    }
  }
`;

export const BtnInverted = styled(Button)`
  border: ${props => (props.disabled ? "none" : "1px solid #EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
  ${props =>
    props.disabled &&
    `
    &:hover, &:active {
      border: none;
      color: #fff;
    }
  `}
`;

BtnInverted.defaultProps = {
  light: true
};
