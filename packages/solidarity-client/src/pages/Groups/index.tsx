import React, { useEffect } from 'react'
import { useLocation, Link, useHistory } from "react-router-dom";
import { Page, Flexbox2 as Flexbox, Title, Spacing } from 'bonde-styleguide'
import ReactTable from 'react-table'
import { useStoreActions } from 'easy-peasy'

import 'react-table/react-table.css'
import columns from './columns'
import { Wrap } from './styles'
import FetchUsersByGroup from '../../graphql/FetchUsersByGroup'

interface Props {
  volunteersCount: number
  individualsCount: number
}

const GroupsMenu: React.FC<Props> = ({ volunteersCount, individualsCount }) =>
  <Spacing margin={{ bottom: 20 }}>
    <Flexbox horizontal>
      <Spacing margin={{ right: 20 }}>
        <Link to="/groups/volunteers">
          <Title.H5 color="#EE0099">
            VOLUNTÁRIAS{' '}({volunteersCount})
          </Title.H5>
        </Link>
      </Spacing>
      <Link to="/groups/individuals">
        <Title.H5 color="#EE0099">
          PSRs{' '}({individualsCount})
        </Title.H5>
      </Link>
    </Flexbox>
  </Spacing>

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
              {GroupsMenu(
                {
                  volunteersCount: volunteers.count || 0,
                  individualsCount: individuals.count || 0,
                }
              )}
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
