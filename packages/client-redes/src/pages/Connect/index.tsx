import React, { useCallback, Fragment, useState, useEffect } from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import * as turf from "@turf/turf";
import { useHistory, useLocation } from "react-router-dom";
import { Flexbox2 as Flexbox, Title, Spacing } from "bonde-styleguide";
import { Loading } from "bonde-components";
import { useMutation, useSession } from "bonde-core-tools";

import FetchIndividuals from "../../graphql/FetchIndividuals";
import CREATE_RELATIONSHIP from "../../graphql/CreateRelationship";
import { USERS_BY_GROUP } from "../../graphql/FetchUsersByGroup";
import { Individual } from "../../types";
import useAppLogic from "../../app-logic";
import columns from "./columns";

import Popup from "../../components/Popups/Popup";
import Success from "../../components/Popups/Success";
import Error from "../../components/Popups/Error";
import Confirm from "../../components/Popups/Confirm";
import { Wrap, StyledButton } from "./style";
import { Filters } from "../../services/FilterProvider";

type onConfirm = {
  individual_id: number;
  volunteer_id: number;
  agent_id: number;
  popups: Record<string, string>;
  filters: Filters;
};

const Table = () => {
  const {
    individual: { first_name: individual_name, id: individual_id },
    volunteer: {
      first_name: volunteer_name,
      id: volunteer_id
      // email: volunteer_email
    },
    popups,
    createWhatsappLink,
    parsedIndividualNumber,
    parsedVolunteerNumber,
    setVolunteer,
    setPopup,
    volunteer_lat,
    volunteer_lng,
    distance,
    agent,
    volunteer_text,
    individual_text
  } = useAppLogic();

  const [createConnection, { data, loading, error }] = useMutation(
    CREATE_RELATIONSHIP
  );

  const { goBack, push } = useHistory();
  const { state: linkState = { volunteer: {} } } = useLocation();
  const { community = { id: 0 } } = useSession();

  const [success, setSuccess] = useState(false);
  const [isLoading, setLoader] = useState(false);

  useEffect(() => {
    setLoader(loading);
    if (data) setSuccess(true);
    // retorna para a home caso não exista nenhuma voluntária no linkState
    if (Object.keys(linkState.volunteer).length < 1) return push("/");
  }, [setLoader, loading, error, data, linkState, push]);

  const filterByDistance = useCallback(
    data =>
      data
        .map(i => {
          const pointA = [
            Number(i.coordinates.latitude),
            Number(i.coordinates.longitude)
          ];

          return {
            ...i,
            distance:
              !Number.isNaN(pointA[0]) &&
              !Number.isNaN(pointA[1]) &&
              volunteer_lat &&
              volunteer_lng &&
              Number(
                turf.distance([volunteer_lat, volunteer_lng], pointA)
              ).toFixed(2)
          };
        })
        .filter(i => {
          if (!volunteer_lat || !volunteer_lng) {
            return true;
          }
          return i.distance && Number(i.distance) < distance;
        })
        .sort((a, b) => Number(a.distance) - Number(b.distance)),
    [distance, volunteer_lat, volunteer_lng]
  );

  const onConfirm = ({
    individual_id,
    volunteer_id,
    agent_id,
    popups,
    filters
  }: onConfirm) => {
    setPopup({ ...popups, confirm: false });
    return createConnection({
      variables: {
        recipientId: individual_id,
        volunteerId: volunteer_id,
        agentId: agent_id
      },
      refetchQueries: [
        {
          query: USERS_BY_GROUP,
          variables: {
            context: { _eq: community.id },
            ...filters,
            page: undefined
          }
        }
      ]
    });
  };

  const closeAllPopups = (): void => {
    setSuccess(false);
    setPopup({
      wrapper: false,
      confirm: false
    });
    goBack();
  };

  return (
    <FetchIndividuals>
      {({
        data,
        changeFilters,
        filters
      }: {
        data: Individual[];
        changeFilters;
        filters: Filters;
      }) => {
        // Seta a voluntária
        setVolunteer(linkState && linkState.volunteer);
        const filteredTableData = filterByDistance(data);

        const resizeRow = data.length < 1000 ? data.length : filters.rows;

        return data.length === 0 ? (
          <Flexbox middle>
            <Wrap>
              <Title.H3 margin={{ bottom: 30 }}>Nenhum resultado.</Title.H3>
            </Wrap>
          </Flexbox>
        ) : (
          <Fragment>
            <Flexbox vertical middle>
              <Wrap>
                <Flexbox vertical>
                  <Spacing margin={{ bottom: 20 }}>
                    <Flexbox>
                      <StyledButton flat onClick={goBack}>
                        {"< fazer match"}
                      </StyledButton>
                    </Flexbox>
                    <Spacing margin={{ top: 10, bottom: 10 }}>
                      <Title.H3>Match realizado!</Title.H3>
                    </Spacing>
                    <Title.H5 color="#444444">
                      {`${filteredTableData.length} solicitações de PSRs próximas de ${volunteer_name}`}
                    </Title.H5>
                  </Spacing>
                </Flexbox>
                <ReactTable
                  data={filteredTableData}
                  columns={columns}
                  manual
                  sortable={false}
                  pageSize={resizeRow}
                  pageSizeOptions={[25, 50, 100, 200, 500, 1000]}
                  page={filters.page}
                  onPageChange={(page: number): void =>
                    changeFilters({ type: "page", value: page })
                  }
                  onPageSizeChange={(rows: number): void =>
                    changeFilters({ type: "rows", value: rows })
                  }
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
            <Popup
              individualName={individual_name}
              volunteerName={volunteer_name}
              onSubmit={() =>
                onConfirm({
                  individual_id,
                  volunteer_id,
                  agent_id: agent.id,
                  popups,
                  filters
                })
              }
              isOpen={popups.wrapper}
              onClose={closeAllPopups}
            >
              {props => {
                return isLoading ? (
                  <Loading />
                ) : (
                  <>
                    <Confirm {...props} isEnabled={popups.confirm} />
                    <Success
                      {...props}
                      link={{
                        individual: (): string | undefined =>
                          createWhatsappLink(
                            parsedIndividualNumber,
                            individual_text
                          ),
                        volunteer: (): string | undefined =>
                          createWhatsappLink(
                            parsedVolunteerNumber,
                            volunteer_text
                          )
                      }}
                      isEnabled={success}
                    />
                    <Error
                      {...props}
                      message={(error && error.message) || ""}
                      isEnabled={error}
                    />
                  </>
                );
              }}
            </Popup>
          </Fragment>
        );
      }}
    </FetchIndividuals>
  );
};

export default Table;
