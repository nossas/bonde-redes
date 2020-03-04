import React, { useMemo, useCallback, useEffect } from 'react'
import ReactTable from 'react-table'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import { useStoreState, useStoreActions } from 'easy-peasy'
import * as turf from '@turf/turf'
import useAppLogic from '../../../app-logic'
import { Ticket } from '../../../models/table-data'
import columns from './columns'
// import { zendeskOrganizations, isVolunteer } from '../../../services/utils'

import { FullWidth } from './style'

import 'react-table/react-table.css'

const Table: React.FC = () => {
  const searchForm = useStoreState(state => state.geobonde.form)
  const getTableData = useStoreActions((actions: any) => actions.table.getTableData)

  const {
    tableData
  } = useAppLogic()

  useEffect(() => {
    getTableData('all')
  }, [getTableData])

  const {
    distance,
    lat,
    lng,
    // individual,
    // lawyer,
    // therapist
  } = searchForm

  const filterByDistance = useCallback((data: Ticket[]) => data.map((i) => {
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

  // const filterByCategory = useCallback((data: Ticket[]) => data.filter((i) => {

  //   if (i.organization_id === zendeskOrganizations.therapist) {
  //     if (!therapist) {
  //       return false
  //     }
  //   } else if (i.organization_id === zendeskOrganizations.lawyer) {
  //     if (!lawyer) {
  //       return false
  //     }
  //   } else if (i.organization_id === zendeskOrganizations.individual) {
  //     if (!individual) {
  //       return false
  //     }
  //   }

  //   return true
  //   // eslint-disable-next-line
  // }), [individual, lawyer, therapist])

  // const filterByUserCondition = useCallback((data: Ticket[]) => data.filter((i) => {
  //   if (isVolunteer(i.organization_id)) {
  //     switch (i.condition) {
  //       case 'disponivel':
  //         return true
  //       case 'aprovada':
  //         return true
  //       case 'desabilitada':
  //         return true
  //       default:
  //         return false
  //     }
  //   } else if (!isVolunteer(i.organization_id)) return true
  //   return false
  // }), [])

  const filteredTableData = useMemo(() => {
    const data = filterByDistance(tableData)

    return data
  }, [filterByDistance, tableData])

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
