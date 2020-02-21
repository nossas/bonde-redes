import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from "react-router-dom";
import { Page, Flexbox2 as Flexbox, Title, Spacing } from 'bonde-styleguide'
import { If } from '../../components/If'
import Volunteers from '../VolunteersAvailable'
import { useStoreState, useStoreActions } from 'easy-peasy'
import ReactTable from 'react-table'
import columns from './columns'
import { Wrap } from './styles'
import 'react-table/react-table.css'
import { SessionHOC } from "../../services/session";
import FetchUsersByGroup from '../../graphql/FetchUsersByGroup'

interface Props {
  volunteersCount: number
  individualsCount: number
}

const GroupsMenu: React.FC<Props> = ({ volunteersCount, individualsCount }, { getVolunteers, getIndividuals }) => 
  <Spacing margin={{ bottom: 20 }}>
    <Flexbox horizontal>
      <Spacing margin={{ right: 20 }}>
        <Title.H5 color="#EE0099" onClick={getVolunteers}>
          VOLUNTÁRIAS{' '}({volunteersCount})
        </Title.H5>
      </Spacing>
      <Title.H5 color="#EE0099" onClick={getIndividuals}>
        PSRs{' '}({individualsCount})
      </Title.H5>
    </Flexbox>
  </Spacing>

const Groups = ({ match }) => {
  const tableData = useStoreState(state => state.table.data)
  const count = useStoreState(state => state.table.count)
  const getAvailableVolunteers = useStoreActions((actions: any) => actions.table.getTableData)
  // @ts-ignore
  const { pathname } = useLocation()
  const kind = pathname.split('/')[2] 
  const dicio = {
    "volunteers": kind["data"],
    "individuals": kind["data"]
  }
  useEffect(() => {
    getAvailableVolunteers("volunteers")
  }, [getAvailableVolunteers])

  const data = {
    volunteers: tableData,
    individuals: []
  }

  return (
    <Page>
      <Flexbox middle>
        <Wrap>
          {GroupsMenu(
            { 
              volunteersCount: count || 0,
              individualsCount: 0,
            }, 
            { 
              getVolunteers: () => {}, 
              getIndividuals: () => {} 
            }
          )}
          <ReactTable
            data={data[kind]}
            columns={columns(pathname)}
            defaultPageSize={10}
            defaultSorted={[
              {
                id: "availability",
                desc: true
              }
            ]}
            className="-striped -highlight"
          />
        </Wrap>
      </Flexbox>
    </Page>
  )
}

export default Groups