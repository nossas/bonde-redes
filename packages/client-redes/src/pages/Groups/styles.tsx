import styled from "styled-components";
import { Header } from 'bonde-components';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;

  ${Header.h4} {
    margin: 20px 0 25px;
  }

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
