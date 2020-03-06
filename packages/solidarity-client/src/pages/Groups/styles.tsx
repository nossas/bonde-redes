import styled from 'styled-components'
import { Button } from 'bonde-styleguide'

export const Wrap = styled.div`
  @media(min-width: 768px) {
    width: 90%;
  }
  margin: 20px 0;

  .ReactTable {
    border: 1px solid #c7c7c7;

    .rt-thead {
      .rt-th, .rt-td {
        padding: 5px 5px;
      }
    }
    .rt-tbody {
      .rt-th, .rt-td {
        padding: 10px 5px;
        margin: auto;
      }
    }
  }
`

export const BtnInverted = styled(Button)`
  border-color: ${props => (props.disabled ? "unset" : "#EE0090")}
  color: ${props => (props.disabled ? "#fff" : "#EE0090")}
`;

BtnInverted.defaultProps = {
  light: true
}

export const Select = styled.select`
  text-transform: capitalize;
  padding: 5px 0 2px 5px;
  width: 100%;
  border-bottom: 1px solid #ee0099;
  &:active, &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204);
  }
  &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204)
  }
`
export const Option = styled.option`
  text-transform: capitalize;
`