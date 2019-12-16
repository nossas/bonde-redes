import React, { useMemo, useCallback, Fragment, useState } from 'react'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import { useStateLink } from '@hookstate/core'
import * as turf from '@turf/turf'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'

import GlobalContext from '../../../context'
import { encodeText, whatsappText, parseNumber } from '../../../services/utils'
import request from '../../../services/request'
import { FullWidth, Spacing } from './style'
import {
  filterByCategory,
  filterByTicketStatus,
  filterByUserType
} from './filters'
import columns from './columns'
import { If } from '../../../components/If'
import Popup from '../../../components/Popup'

const createWhatsappLink = (number, textVariables) => {
  if(!number) alert('Essa voluntária não possui Whatsapp')
  const whatsappphonenumber = parseNumber(number)
  const urlencodedtext = encodeText(whatsappText(textVariables))
  return `https://wa.me/55${whatsappphonenumber}/?text=${urlencodedtext}`
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
    name: individual_name,
    ticket_id: individual_ticket_id
  } = individual.value

  const {
    latitude,
    longitude,
    email: volunteer_email,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    organization_id: volunteer_organization_id,
    phone: volunteer_phone,
    user_id: volunteer_user_id,
    registration_number: volunteer_registry
  } = volunteer.value

  const distance = 50
  const lat = Number(latitude)
  const lng = Number(longitude)

  const filterByDistance = useCallback((data) => data.map((i) => {
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

  const filteredTableData = useMemo(() => {
    const data = filterByUserType(
      filterByDistance(
        filterByTicketStatus(
          filterByCategory(
            tableData.get(), volunteer_organization_id
          )
        )
      ),
    )
    return data
  }, [filterByDistance, tableData, volunteer_organization_id])

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState({ status: false, message: ''})
  const [ticketId, setTicketId] = useState(0)

  const submitConfirm = async (requestBody) => {
    console.log(requestBody)
    const mockedBody = {
      "volunteer_name": "Ana Teste teste",
      "individual_name": "ANA MSR teste match automatizado",
      "individual_ticket_id": 16013,
      "agent": 373018450472,
      "volunteer_organization_id": 360269610652,
      "volunteer_registry": "99999",
      "volunteer_phone": "11999999999",
      "volunteer_user_id": 377577169651
    }
    try {
      const response = await request.post(JSON.stringify(mockedBody))

      if (response.status === 200) {
        setTicketId(response.data && response.data.ticketId)
        setSuccess(true)
        popups.set(prevState => ({
          ...prevState,
          confirm: false,
          forward: true
        }))
      }
    }
    catch(e) {
      console.log(e)
      setError({
        status: true,
        message: e
      })
    }
  }

  const closeAllPopups = () => {
    setSuccess(false)
    setError(false)
    popups.set({
      wrapper: false,
      confirm: false,
      forward: false
    })
  }

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
              {`${filteredTableData.length} solicitações de MSRs próximas de ${volunteer_name}`}
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
            individualName={individual_name}
            volunteerName={volunteer_name}
            confirm={{
              onClose: closeAllPopups,
              onSubmit: () => submitConfirm({
                agent: zendeskAgent.value,
                individual_name,
                individual_ticket_id,
                volunteer_name,
                volunteer_user_id,
                volunteer_registry,
                volunteer_phone,
                volunteer_organization_id,
            }),
              isEnabled: confirm
            }}
            success={{
              onClose: closeAllPopups,
              link: () => createWhatsappLink(
                volunteer_whatsapp, { volunteer_name, individual_name, agent: zendeskAgent.value }
              ),
              isEnabled: success,
              ticketId
            }}
            error={{
              onClose: closeAllPopups,
              onSubmit: () => submitConfirm({
                agent: zendeskAgent.value,
                individual_name,
                individual_ticket_id,
                volunteer_name,
                volunteer_user_id,
                volunteer_registry,
                volunteer_phone,
                volunteer_organization_id,
              }),
              isEnabled: error.status,
              message: error.message
            }}
            isOpen={wrapper}
            onClose={closeAllPopups}
        />
      </If>
    </Fragment>
  )
}

export default Table
