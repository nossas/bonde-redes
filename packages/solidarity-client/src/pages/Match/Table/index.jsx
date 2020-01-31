import React, { useMemo, useCallback, Fragment, useState } from 'react'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import * as turf from '@turf/turf'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import { useStoreState, useStoreActions } from 'easy-peasy'

import {
  encodeText,
  whatsappText,
  parseNumber,
  isVolunteer,
  zendeskOrganizations
} from '../../../services/utils'
import { FullWidth, Spacing } from './style'
import columns from './columns'

import { If } from '../../../components/If'
import Popup from '../../../components/Popups/Popup'

const Table = () => {

  const volunteer = useStoreState(state => state.match.volunteer)
  const zendeskAgent = useStoreState(state => state.match.agent)
  const zendeskAgentName = useStoreState(state => state.match.assignee_name)

  const popups = useStoreState(state => state.popups.data)
  const tableData = useStoreState(state => state.table.data)
  const individual = useStoreState(state => state.individual.data)
  const error = useStoreState(state => state.error.error)

  const setPopup = useStoreActions(actions => actions.popups.setPopup)
  const setError = useStoreActions(actions => actions.error.setError)
  const fowardTickets = useStoreActions(actions => actions.foward.fowardTickets)
  
  const [success, setSuccess] = useState(false)
  const [ticketId, setTicketId] = useState(0)
  const [isLoading, setLoader] = useState(false)

  const {
    confirm,
    wrapper,
    noPhoneNumber
  } = popups

  const {
    name: individual_name,
    ticket_id: individual_ticket_id
  } = individual

  const {
    latitude,
    longitude,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    organization_id: volunteer_organization_id,
    phone,
    user_id: volunteer_user_id,
    registration_number: volunteer_registry
  } = volunteer

  const distance = 50
  const lat = Number(latitude)
  const lng = Number(longitude)

  const createWhatsappLink = (number, textVariables) => {
    if (!number) return ''
    const whatsappphonenumber = parseNumber(number)
    const urlencodedtext = encodeText(whatsappText(textVariables))
    return `https://api.whatsapp.com/send?phone=55${whatsappphonenumber}&text=${urlencodedtext}`
  }

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

  const volunteer_category = input => {
    if (input === zendeskOrganizations.lawyer) return 'jurídico'
    if (input === zendeskOrganizations.therapist) return 'psicológico'
  }

  const filterByCategoryAndUserType = useCallback((data) => data.filter((i) => {
    const selectedCategory = volunteer_category(volunteer_organization_id)

    if (!isVolunteer(i.organization_id)) {
      switch (i.tipo_de_acolhimento) {
       case selectedCategory:
        return true
       case 'psicológico_e_jurídico':
         return true
       default:
         return false
      }
    } 

    return false
    // eslint-disable-next-line
  }), [volunteer_organization_id])

  const filterByStatus = useCallback((data) => data.filter((i) => {
    if (i.status_acolhimento === 'solicitação_recebida') {
      switch (i.ticket_status) {
       case 'open':
        return true
       case 'new':
         return true
       default:
         return false
      }
    } 

    return false
    // eslint-disable-next-line
  }), [])

  // const filterByEmail = useCallback((data) => data.filter((i) => i.email === 'teste2@email.com'), [])

  const filteredTableData = useMemo(() => {
    const data = filterByDistance(
      filterByCategoryAndUserType(
        filterByStatus(
          tableData,
        )
      )
    )

    return data
    // eslint-disable-next-line
  }, [tableData])

  const submitConfirm = async (requestBody) => {
    const req = await fowardTickets({
      setError,
      setSuccess,
      data: requestBody
    })
    if (req && req.status === 200) {
      setLoader(false)
      setTicketId(req.data.ticketId)
    }
  }

  const onConfirm = () => {
    if (!volunteer_whatsapp) return setPopup({
      ...popups,
      noPhoneNumber: true,
      confirm: false
    })
    setPopup({ ...popups, confirm: false })
    setLoader(true)
    return submitConfirm({
      agent: zendeskAgent,
      individual_name,
      individual_ticket_id,
      volunteer_name,
      volunteer_user_id,
      volunteer_registry,
      volunteer_phone: Number(parseNumber(phone || 0)),
      volunteer_organization_id,
      assignee_name: zendeskAgentName
    })
  }

  const closeAllPopups = () => {
    setError({
      status: false,
      message: ''
    })
    setSuccess(false)
    setPopup({
      wrapper: false,
      confirm: false
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
              onSubmit: onConfirm,
              isEnabled: confirm
            }}
            success={{
              onClose: closeAllPopups,
              link: () => createWhatsappLink(
                volunteer_whatsapp, { volunteer_name, individual_name, agent: zendeskAgentName }
              ),
              isEnabled: success,
              ticketId
            }}
            error={{
              onClose: closeAllPopups,
              onSubmit: onConfirm,
              isEnabled: error.status,
              message: error.message
            }}
            warning={{
              isEnabled: noPhoneNumber,
              id: volunteer_user_id,
              name: volunteer_name
            }}
            isOpen={wrapper}
            onClose={closeAllPopups}
            isLoading={isLoading}
        />
      </If>
    </Fragment>
  )
}

export default Table
