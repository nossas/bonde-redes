import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Page,
  Flexbox2 as Flexbox,
  Spacing,
  Dropdown,
  DropdownItem
} from 'bonde-styleguide'
import ReactTable from 'react-table'
import { useStoreActions } from 'easy-peasy'

import 'react-table/react-table.css'
import columns from './columns'
import filters from './filters'
import { Wrap } from './styles'

import FetchUsersByGroup from '../../graphql/FetchUsersByGroup'

const Filters = ({ filters }): any => {

  return (
    <Flexbox horizontal>
      {filters.map(({ items, name }): any => 
        <Spacing margin={{ right: 20 }}>
          <Dropdown label={name} inverted>
            {items.map(({ onClick, option }): any => 
              <DropdownItem onClick={onClick}>
                {option}
              </DropdownItem>
            )}
          </Dropdown>
        </Spacing>
      )}
    </Flexbox>
  )  
}

const Groups = () => {
  // @ts-ignore
  const location = useLocation()
  const kind = location.pathname.split('/')[2]
  const history = useHistory()
  const setTable = useStoreActions((actions: any) => actions.table.setTable)

  useEffect(() => {
    history.push("/groups/volunteers")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FetchUsersByGroup>
      {({ volunteers, individuals, filters: filtersValues, changeFilters, page }) => {
      const data = {
        volunteers: volunteers.data,
        individuals: individuals.data
      }
      setTable({
        individuals: individuals.data,
        volunteers: volunteers.data
      })

      const pages = kind === 'volunteers'
        ? Math.ceil(volunteers.count / filtersValues.rows)
        : Math.ceil(individuals.count / filtersValues.rows)

      return (
        <Page>
          <Flexbox middle>
            <Wrap>
              <Spacing margin={{ bottom: 20 }}>
                <Filters
                  filters={filters({
                    volunteersCount: volunteers.count || 0,
                    individualsCount: individuals.count || 0,
                    filters: { values: filtersValues, change: changeFilters },
                    history,
                    kind
                  })}
                />
              </Spacing>
              <ReactTable
                manual
                sortable={false}
                data={data[kind]}
                columns={columns(location.pathname)}
                pageSize={filtersValues.rows}
                page={page}
                pages={pages}
                onPageChange={(page) => changeFilters({ page })}
                onPageSizeChange={(rows) => changeFilters({ rows })}
                previousText="Anterior"
                nextText="Próximo"
                pageText="Página"
                ofText="de"
                rowsText="linhas"
                // Accessibility Labels
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
