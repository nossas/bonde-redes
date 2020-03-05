import styled from 'styled-components'

export const Wrap = styled.div`
  @media(min-width: 768px) {
    width: 90%;
  }
  margin: 20px 0;

  .ReactTable {
  	border: none;

  	.rt-th, .rt-tr {
  		padding: 16px 5px;
  	}
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 100px;
`
