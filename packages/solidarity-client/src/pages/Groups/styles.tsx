import styled from 'styled-components'

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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 100px;
`
