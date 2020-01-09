import React, { useMemo, useCallback, Fragment, useState } from 'react'
import 'react-table/react-table.css'
import ReactTable from 'react-table'
import * as turf from '@turf/turf'
import { Flexbox2 as Flexbox, Title } from 'bonde-styleguide'
import { useStoreState, useStoreActions } from 'easy-peasy'

import { encodeText, whatsappText, parseNumber } from '../../../services/utils'
import { FullWidth, Spacing } from './style'
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

  const volunteer = useStoreState(state => state.match.volunteer)
  const zendeskAgent = useStoreState(state => state.match.agent)
  const popups = useStoreState(state => state.popups.data)
  const tableData = useStoreState(state => state.table.data)
  const individual = useStoreState(state => state.individual.data)
  const error = useStoreState(state => state.error.error)
  const resData = useStoreState(state => state.foward.data)

  const setPopup = useStoreActions(actions => actions.popups.setPopup)
  const setError = useStoreActions(actions => actions.error.setError)
  const fowardTickets = useStoreActions(actions => actions.foward.fowardTickets)
  
  const [success, setSuccess] = useState(false)

  const {
    confirm,
    wrapper
  } = popups

  const {
    // email: individualEmail,
    name: individual_name,
    ticket_id: individual_ticket_id
  } = individual

  const {
    latitude,
    longitude,
    // email: volunteer_email,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    organization_id: volunteer_organization_id,
    phone: volunteer_phone,
    user_id: volunteer_user_id,
    registration_number: volunteer_registry
  } = volunteer

  const distance = 50
  const lat = Number(latitude)
  const lng = Number(longitude)
//  const zendeskOrganizations = JSON.parse(process.env.REACT_APP_ZENDESK_ORGANIZATIONS || '{}')

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

//  const volunteer_category = input => {
//    if (input === zendeskOrganizations.lawyer) return 'jurídico'
//    if (input === zendeskOrganizations.therapist) return 'psicológico'
//  }

//  const filterByCategory = data => data.filter(
//    (i) => (
//      i.tipo_de_acolhimento === volunteer_category(volunteer_organization_id) ||
//      i.tipo_de_acolhimento === 'psicológico_e_jurídico'
//    )
//  )
  
//  const filterByUserType = data => data.filter(
//    (i) => i.organization_id === zendeskOrganizations.individual
//  )
//  
//  const filterByTicketStatus = data => data.filter(
//    (i) => {
//      if (i.ticket_status === 'new' || i.ticket_status === 'open') return true
//      if (i.status_acolhimento === 'solicitacao_recebida') return true
//      return false
//    }
//  )

  console.log({ tableData })

  const filteredTableData = useMemo(() => {
    const data = filterByDistance(
      tableData,
    )

    return data
    // eslint-disable-next-line
  }, [filterByDistance, tableData])

  const submitConfirm = async (requestBody) => {
    fowardTickets({
      setError,
      setSuccess,
      data: requestBody
    })
  }

  const onConfirm = () => {
    setPopup({ ...popups, confirm: false })
    return submitConfirm({
      agent: zendeskAgent,
      individual_name,
      individual_ticket_id,
      volunteer_name,
      volunteer_user_id,
      volunteer_registry,
      volunteer_phone,
      volunteer_organization_id,
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
                volunteer_whatsapp, { volunteer_name, individual_name, agent: zendeskAgent }
              ),
              isEnabled: success,
              ticketId: resData && resData.ticketId
            }}
            error={{
              onClose: closeAllPopups,
              onSubmit: () => submitConfirm({
                agent: zendeskAgent,
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
