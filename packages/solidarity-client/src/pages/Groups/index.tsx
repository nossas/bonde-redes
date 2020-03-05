import React, { useEffect } from 'react'
import { useLocation, useHistory } from "react-router-dom";
import { History } from 'history'
import { 
  Page, 
  Flexbox2 as Flexbox, 
  Title, 
  Spacing, 
  Dropdown, 
  DropdownHeader, 
  DropdownItem, 
  Icon 
} from 'bonde-styleguide'
import ReactTable from 'react-table'
import { useStoreActions } from 'easy-peasy'

import 'react-table/react-table.css'
import columns from './columns'
import filters from './filters'
import { Wrap, Grid } from './styles'
import FetchUsersByGroup from '../../graphql/FetchUsersByGroup'

const Filters = ({ filters }): any => 
  filters.map(({ items, name }): any => 
    <Dropdown label={name} inverted>
      {items.map(({ onClick, option }): any => 
        <DropdownItem onClick={onClick}>
          {option}
        </DropdownItem>
      )}
    </Dropdown>
  )

const Groups = () => {
  // @ts-ignore
  const { pathname } = useLocation()
  const kind = pathname.split('/')[2]
  const history = useHistory()
  const setTable = useStoreActions((actions: any) => actions.table.setTable)

  useEffect(() => {
    history.push("/groups/volunteers")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FetchUsersByGroup>
      {({ volunteers, individuals }) => {
      const data = {
        volunteers: volunteers.data,
        individuals: individuals.data
      }
      setTable({
        individuals: individuals.data,
        volunteers: volunteers.data
      })
      return (
        <Page>
          <Flexbox middle>
            <Wrap>
              <Spacing margin={{ bottom: 20 }}>
                <Grid>
                  <Filters 
                    filters={filters({ 
                      volunteersCount: volunteers.count || 0, 
                      individualsCount: individuals.count || 0, 
                      history 
                    })}
                  />
                </Grid>
              </Spacing>
              <ReactTable
                data={data[kind]}
                columns={columns}
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
    }}
    </FetchUsersByGroup>
  )
}

export default Groups
