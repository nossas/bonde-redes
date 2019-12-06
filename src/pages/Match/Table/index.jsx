import React, { useMemo, useCallback } from 'react'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import { useStateLink } from '@hookstate/core'
import * as turf from '@turf/turf'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'

import GlobalContext from 'context'
import { PointUser } from 'context/table'
import { FullWidth, Spacing } from './style'
import columns from './columns'

const Table = () => {
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

  const filterByDistance = useCallback((data) =>
    data
      .map((i) => {
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
      })
      .filter((i) => {
        if (!lat || !lng) {
          return true
        }
        return i.distance && Number(i.distance) < distance
      })
      .sort((a, b) => Number(a.distance) - Number(b.distance)), [distance, lat, lng])

  const filterByCategory = useCallback((data) => 
    data
      .filter((i) => {
      const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS)

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
    }), [individual, lawyer, therapist])

  const filteredTableData = useMemo(() => {
    const data = filterByCategory(
      filterByDistance(
        tableData.get(),
      ),
    )

    return data
  }, [filterByCategory, filterByDistance, tableData])

  const volunteer = 'Débora Silva'

  return filteredTableData.length === 0 ? (
    <FullWidth>
      <Flexbox>
        <Title.H3 margin={{ bottom: 30 }}>
          Nenhum resultado.
        </Title.H3>
      </Flexbox>
    </FullWidth>
  ) : (
    <FullWidth>
      <Flexbox vertical>
        <Spacing margin="10">
          <Title.H3>Match realizado!</Title.H3>
        </Spacing>
        <Spacing margin="25">
          <Title.H5 color="#444444">
            {`${filteredTableData.length} solicitações de MSRs próximas de ${volunteer}`}
          </Title.H5>
        </Spacing>
        <ReactTable
          data={filteredTableData}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Flexbox>
    </FullWidth>
  )
}

export default Table
