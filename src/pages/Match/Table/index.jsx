import React, { useMemo, useCallback, Fragment, useState } from 'react'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import { useStateLink } from '@hookstate/core'
import * as turf from '@turf/turf'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'

import GlobalContext from 'context'
import { encodeText } from 'services/utils'
import { FullWidth, Spacing } from './style'
import {
  filterByCategory,
  filterByTicketStatus,
  filterByUserType
} from './filters'
import columns from './columns'
import { If } from 'components/If'
import Popup from 'components/Popup'

// https://wa.me/whatsappphonenumber/?text=urlencodedtext

const createWhatsappLink = number => {
  const whatsappphonenumber = parseNumber(number)
  const urlencodedtext = encondeText(text)
  return `https://wa.me/${whatsappphonenumber}/?text=${urlencodedtext}`
}

const Table = () => {
  const {
    table: { tableDataRef },
    matchTable: { individualRef },
    matchForm: { volunteerRef, zendeskAgentRef },
    popups: { popupsRef }
  } = GlobalContext

  const volunteer = useStateLink(volunteerRef)
  const tableData = useStateLink(tableDataRef)
  const popups = useStateLink(popupsRef)
  const zendeskAgent = useStateLink(zendeskAgentRef)
  const individual = useStateLink(individualRef)

  const { confirm, forward, wrapper } = popups.value
  const {
    email: individualEmail,
    name: individualName,
    ticket_id: individualTicket
  } = individual.value

  const {
    latitude,
    longitude,
    email: volunteerEmail,
    name: volunteerName,
    ticket_id: volunteerTicket,
    whatsapp: volunteerNumber,
    organization_id
  } = volunteer.value

  const distance = 50
  const lat = Number(latitude)
  const lng = Number(longitude)

  const filterByDistance = useCallback((data) => data
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
      if (!lat || !lng) return true
      return i.distance && Number(i.distance) < distance
    })
    .sort((a, b) => Number(a.distance) - Number(b.distance)), [distance, lat, lng])

  const filteredTableData = useMemo(() => {
    const data = filterByUserType(
      filterByDistance(
        filterByTicketStatus(
          filterByCategory(
            tableData.get(), organization_id
          )
        ),
      ),
    )
    return data
  }, [filterByCategory, filterByDistance, filterByTicketStatus, filterByUserType, tableData])

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  return filteredTableData.length === 0 ? (
    <FullWidth>
      <Flexbox>
        <Title.H3 margin={{ bottom: 30 }}>
          Nenhum resultado.
        </Title.H3>
      </Flexbox>
    </FullWidth>
  ) : (
    <Fragment>
      <FullWidth>
        <Flexbox vertical>
          <Spacing margin="10">
            <Title.H3>Match realizado!</Title.H3>
          </Spacing>
          <Spacing margin="25">
            <Title.H5 color="#444444">
              {`${filteredTableData.length} solicitações de MSRs próximas de ${volunteerName}`}
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
      <If condition={wrapper}>
        <Popup
          individualName={individualName}
          volunteerName={volunteerName}
          confirm={{
            onClose: () => popups.set({
              confirm: false,
              wrapper: false
            }),
            onSubmit: () => alert('encaminhando!'),
            isEnabled: confirm
          }}
          success={{
            onClose: () => popups.set({
              forward: false,
              wrapper: false
            }),
            onSubmit: () => alert('encaminhando!'),
            isEnabled: success,
          }}
          error={{
            onClose: () => popups.set({
              forward: false,
              wrapper: false
            }),
            onSubmit: () => alert('encaminhando novamente!'),
            isEnabled: error,
            message: 'erro'
          }} 
          isOpen={wrapper}
          onClose={() => popups.set({
            wrapper: false,
            confirm: false,
            forward: false
          })}
        />
      </If>
    </Fragment>
  )
}

export default Table
