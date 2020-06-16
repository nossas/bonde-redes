import React, { useCallback, useState, useEffect } from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import * as turf from "@turf/turf";
import { useHistory, useLocation } from "react-router-dom";
import { Flexbox2 as Flexbox, Spacing } from "bonde-styleguide";
import { Loading, Header } from "bonde-components";
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
import { StyledButton, WrapLabel, Wrap } from "./style";
import { Filters } from "../../services/FilterProvider";

type onConfirm = {
  individual_id: number;
  volunteer_id: number;
  popups: Record<string, string>;
  filters: Filters;
};

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const distanceA = a.distance;
  const distanceB = b.distance;

  let comparison = 0;
  if (distanceA > distanceB) {
    comparison = 1;
  } else if (distanceA < distanceB) {
    comparison = -1;
  }
  return comparison;
}

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
    volunteer_text,
    individual_text
  } = useAppLogic();

  const [createConnection, { data, loading, error }] = useMutation(
    CREATE_RELATIONSHIP
  );

  const { goBack, push } = useHistory();
  const { state: linkState = { volunteer: {} } } = useLocation();
  const { user, community = { id: 0 } } = useSession();

  const [success, setSuccess] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [isShowing, showIncorrectZipcodes] = useState(true);

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
              Number(
                !Number.isNaN(pointA[0]) &&
                  !Number.isNaN(pointA[1]) &&
                  volunteer_lat &&
                  volunteer_lng &&
                  Number(
                    turf.distance([volunteer_lat, volunteer_lng], pointA)
                  ).toFixed(2)
              ) || null
          };
        })
        .sort(compare),
    [volunteer_lat, volunteer_lng]
  );

  if (!community) return "Selecione uma comunidade";

  const onConfirm = ({
    individual_id,
    volunteer_id,
    popups,
    filters
  }: onConfirm) => {
    setPopup({ ...popups, confirm: false });

    const input: any = {
      recipient_id: individual_id,
      volunteer_id,
      status: "pendente"
    }
    const update: any = [
      { id: { _eq: volunteer_id } }, { id: { _eq: individual_id } }
    ]

    if (user.isAdmin) {
      input.user_id = user.id
    }

    return createConnection({
      variables: { input, update },
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
        const filteredTableData = isShowing
          ? filterByDistance(data)
          : filterByDistance(data).filter(i => {
              if (!volunteer_lat || !volunteer_lng) {
                return false;
              }
              return i.distance && Number(i.distance) < distance;
            });

        const resizeRow =
          filteredTableData.length < 1000
            ? filteredTableData.length
            : filters.rows;

        return (
          <>
            <StyledButton dark onClick={goBack}>
              {"< fazer match"}
            </StyledButton>
            {data.length < 1 ? (
              <Spacing margin={{ top: 20 }}>
                <Header.h3>Nenhum resultado.</Header.h3>
              </Spacing>
            ) : (
              <>
                <Flexbox vertical>
                  <Spacing margin={{ bottom: 20 }}>
                    <Flexbox></Flexbox>
                    <Spacing margin={{ top: 10, bottom: 10 }}>
                      <Header.h3>Match realizado!</Header.h3>
                    </Spacing>
                    <Wrap>
                      <Header.h5 color="#444444">
                        {`${filteredTableData.length} solicitações de PSRs próximas de ${volunteer_name}`}
                      </Header.h5>
                      <WrapLabel>
                        <input
                          name="isShowing"
                          type="checkbox"
                          checked={isShowing}
                          onChange={e =>
                            showIncorrectZipcodes(e.target.checked)
                          }
                        />
                        <Header.h5>
                          Mostrar usuários com CEP incorreto
                        </Header.h5>
                      </WrapLabel>
                    </Wrap>
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
                  style={{
                    "max-height": "500px"
                  }}
                />
                <Popup
                  individualName={individual_name}
                  volunteerName={volunteer_name}
                  onSubmit={() =>
                    onConfirm({
                      individual_id,
                      volunteer_id,
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
                          goBack={goBack}
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
              </>
            )}
          </>
        );
      }}
    </FetchIndividuals>
  );
};

export default Table;
