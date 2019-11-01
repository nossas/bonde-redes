import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import GlobalContext from 'context'
import { useStateLink } from '@hookstate/core'
import dicioService from './dicioService'
import { addAccessorVolunteer, addAccessorIndividual } from './columns'
import { FullWidth } from './style'

const Table: React.FC = () => {
  const {
    table: { tableDataRef, submittedParamsRef },
  } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)

  const {
    distance,
    serviceType,
  } = submittedParams.value

  return tableData.value.length === 0 ? (
    <FullWidth>
      <Flexbox>
        <Title.H4 margin={{ bottom: 30 }}>
          Aguardando pesquisa.
        </Title.H4>
      </Flexbox>
    </FullWidth>
  ) : (
    <FullWidth>
      <Flexbox vertical>
        <Title.H2 margin={{ bottom: 20 }}>Match realizado!</Title.H2>
        <Title.H4 margin={{ bottom: 30 }}>
          {`${tableData.value.length} ${dicioService[serviceType]} encontradas em um raio de ${distance}km.`}
        </Title.H4>
        <br />
        <ReactTable
          data={tableData.value}
          columns={['lawyer', 'therapist'].includes(serviceType) ? addAccessorVolunteer() : addAccessorIndividual()}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Flexbox>
    </FullWidth>
  )
}

export default Table
