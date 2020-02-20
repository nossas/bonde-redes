import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { Page, Flexbox2 as Flexbox, Title, Spacing } from 'bonde-styleguide'
import { If } from '../../components/If'
import Volunteers from '../VolunteersAvailable'
import { useStoreState, useStoreActions } from 'easy-peasy'
import ReactTable from 'react-table'
import columns from './columns'
import { Wrap } from './styles'
import 'react-table/react-table.css'

interface Props {
  volunteersCount: number
  individualsCount: number
}

const GroupsMenu: React.FC<Props> = ({ volunteersCount, individualsCount }, { getVolunteers, getIndividuals }) => 
  <Spacing margin={{ top: 20, bottom: 20 }}>
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

const Groups: React.FC = ({ children })  => {
  // @ts-ignore
  const { pathname } = useLocation()
  const tableData = useStoreState(state => state.table.data)
  const count = useStoreState(state => state.table.count)

  const getAvailableVolunteers = useStoreActions((actions: any) => actions.table.getTableData)

  useEffect(() => {
    getAvailableVolunteers('volunteers')
  }, [getAvailableVolunteers])

  const getIndividuals = () => false;

  return (
    <Page>
      <Flexbox middle>
        <Wrap>
          {GroupsMenu(
            { 
              volunteersCount: count || 0, 
              individualsCount: count || 0 
            }, 
            { 
              getVolunteers: getAvailableVolunteers, 
              getIndividuals 
            }
          )}
          <ReactTable
            data={tableData}
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