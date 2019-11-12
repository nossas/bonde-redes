import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import GlobalContext from 'context'
import { useStateLink } from '@hookstate/core'
import * as turf from '@turf/turf'
import { PointUser } from 'context/table'
import { FullWidth } from './style'
import columns from './columns'

const Table: React.FC = () => {
  const {
    table: { tableDataRef, submittedParamsRef },
  } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)

  const {
    distance,
    lat,
    lng,
    individual,
    lawyer,
    therapist,
  } = submittedParams.value

  const filterByDistance = (data: PointUser[]) => data.filter((i) => {
    if (!lat || !lng) {
      return true
    }

    const pointA = [Number(i.latitude), Number(i.longitude)]
    if (Number.isNaN(pointA[0]) || Number.isNaN(pointA[1])) {
      return false
    }

    return turf.distance([lat, lng], pointA) < distance
  })

  const filterByCategory = (data: PointUser[]) => data.filter((i) => {
    const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS!)

    if (i.organization_id === zendeskOrganizations.therapist) {
      if (!therapist) {
        return false
      }
    } else if (i.organization_id === zendeskOrganizations.lawyer) {
      if (!lawyer) {
        return false
      }
    } else if (i.organization_id === zendeskOrganizations.individual) {
      if (!individual) {
        return false
      }
    }

    return true
  })

  const filteredTableData = () => {
    let data = tableData.get()
    data = filterByDistance(data)
    data = filterByCategory(data)

    return data
  }

  return filteredTableData().length === 0 ? (
    <FullWidth>
      <Flexbox>
        <Title.H4 margin={{ bottom: 30 }}>
          Nenhum resultado.
        </Title.H4>
      </Flexbox>
    </FullWidth>
  ) : (
    <FullWidth>
      <Flexbox vertical>
        <Title.H2 margin={{ bottom: 20 }}>Match realizado!</Title.H2>
        <Title.H4 margin={{ bottom: 30 }}>
          {`${tableData.get().length} usuárias encontradas em um raio de ${distance}km.`}
        </Title.H4>
        <br />
        <ReactTable
          data={filteredTableData()}
          columns={columns}
          defaultPageSize={100}
          className="-striped -highlight"
        />
      </Flexbox>
    </FullWidth>
  )
}

export default Table
