import React from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components';

import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'

import 'react-table/react-table.css'
import columns from './columns'

export const Wrap = styled.div`
  width: 90%;
  margin: 40px;
`

const Table: React.FC = () => {
  // TODO: getConnections
  const tableData = []

  return tableData.length === 0 ? (
    <Flexbox middle>
      <Wrap>
        <Title.H4 margin={{ bottom: 30 }}>
          Não existem conexões realizadas nessa comunidade.
        </Title.H4>
      </Wrap>
    </Flexbox>
  ) : (
    <Flexbox middle>
      <Wrap>
        <ReactTable
          data={tableData}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Wrap>
    </Flexbox>
  )
}

export default Table
