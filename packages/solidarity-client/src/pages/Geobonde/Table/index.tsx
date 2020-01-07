import React, { useMemo, useCallback } from 'react'
import ReactTable from 'react-table'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import { useStoreState } from 'easy-peasy'
import * as turf from '@turf/turf'

import 'react-table/react-table.css'
import { User } from '../../../models/table-data'
import { FullWidth } from './style'
import columns from './columns'

const Table: React.FC = () => {
  const tableData = useStoreState(state => state.table.data)
  const searchForm = useStoreState(state => state.geobonde.form)
  const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS!)

  const {
    distance,
    lat,
    lng,
    individual,
    lawyer,
    therapist,
  } = searchForm

  const filterByDistance = useCallback((data: User[]) => data.map((i) => {
    const pointA = [Number(i.latitude), Number(i.longitude)]

    return {
      ...i,
      distance: (
        !Number.isNaN(pointA[0])
        && !Number.isNaN(pointA[1])
        && lat
        && lng
        && Number(turf.distance([lat, lng], pointA)).toFixed(2)
      ),
    }
  }).filter((i) => {
    if (!lat || !lng) {
      return true
    }
    return i.distance && Number(i.distance) < distance
  }).sort((a, b) => Number(a.distance) - Number(b.distance)), [distance, lat, lng])

  const filterByCategory = useCallback((data: User[]) => data.filter((i) => {

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
    // eslint-disable-next-line
  }), [individual, lawyer, therapist])

  const isVolunteer = (organization_id: number) => [zendeskOrganizations['therapist'], zendeskOrganizations['lawyer']].includes(organization_id)

  const filterByUserCondition = (data: User[]) => data.filter(
    (i) => {
      if (isVolunteer(i.organization_id)) {
        return i.condition === 'disponivel' || i.condition === 'aprovada' || i.condition === 'desabilitada'
      }
      return true
    }
  )

  const filteredTableData = useMemo(() => {
    const data = filterByCategory(
      filterByDistance(
        filterByUserCondition(
          tableData,
        )
      ),
    )

    return data
    // eslint-disable-next-line
  }, [filterByCategory, filterByDistance, tableData])

  return filteredTableData.length === 0 ? (
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
          {`${filteredTableData.length} usuárias encontradas em um raio de ${distance}km.`}
        </Title.H4>
        <br />
        <ReactTable
          data={filteredTableData}
          columns={columns}
          defaultPageSize={100}
          className="-striped -highlight"
        />
      </Flexbox>
    </FullWidth>
  )
}

export default Table
