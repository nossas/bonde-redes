import React, {
  useCallback,
  Fragment,
  useState,
  useEffect
} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import * as turf from "@turf/turf";
import { useHistory, useLocation } from "react-router-dom";
import { Flexbox2 as Flexbox, Title, Spacing } from "bonde-styleguide";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useMutation } from '@apollo/react-hooks'

import {
  encodeText,
  whatsappText,
  parseNumber,
  getUserData
} from "../../services/utils";
import { Wrap, StyledButton } from "./style";
import columns from "./columns";
import FetchUsersByGroup from '../../graphql/FetchUsersByGroup'
import CREATE_RELATIONSHIP from '../../graphql/CreateRelationship'

import { If } from "../../components/If";
import Popup from "../../components/Popups/Popup";

const Table = () => {
  const [createConnection, { data, loading, error }] = useMutation(CREATE_RELATIONSHIP);

  const { goBack } = useHistory()
  const { search } = useLocation()

  const setTable = useStoreActions((actions) => actions.table.setTable)
  const setVolunteer = useStoreActions(actions => actions.volunteer.setVolunteer)
  const setPopup = useStoreActions(actions => actions.popups.setPopup);

  const individual = useStoreState(state => state.individual.data);
  const volunteer = useStoreState(state => state.volunteer.data);

  const popups = useStoreState(state => state.popups.data);

  const [success, setSuccess] = useState(false);
  const [fail, setError] = useState(false);
  const [isLoading, setLoader] = useState(false);

  const { confirm, wrapper, noPhoneNumber } = popups;
  const { name: individual_name, phone: individual_phone, id: individual_user_id } = individual;
  const {
    latitude,
    longitude,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    // phone,
    id: volunteer_user_id,
  } = volunteer;

  const distance = 50;
  const lat = Number(latitude);
  const lng = Number(longitude);

  const volunteerFirstName = volunteer_name.split(" ")[0];
  const createWhatsappLink = (number, textVariables) => {
    if (!number) return "";
    const whatsappphonenumber = parseNumber(number);
    const urlencodedtext = encodeText(whatsappText(textVariables));
    return `https://api.whatsapp.com/send?phone=55${whatsappphonenumber}&text=${urlencodedtext}`;
  };
  const getQuery = (search) => Number((search).split('=')[1])

  useEffect(() => {
    setLoader(loading)
    setError(!!(error && error.message))
    if (data) setSuccess(true)
  }, [setLoader, loading, error, setError, data])


  const filterByDistance = useCallback(
    data =>
      data
        .map(i => {
          const pointA = [Number(i.latitude), Number(i.longitude)];

          return {
            ...i,
            distance:
              !Number.isNaN(pointA[0]) &&
              !Number.isNaN(pointA[1]) &&
              lat &&
              lng &&
              Number(turf.distance([lat, lng], pointA)).toFixed(2)
          };
        })
        .filter(i => {
          if (!lat || !lng) {
            return true;
          }
          return i.distance && Number(i.distance) < distance;
        })
        .sort((a, b) => Number(a.distance) - Number(b.distance)),
    [distance, lat, lng]
  );

  // const filterByCategory = useCallback(
  //   data =>
  //     data.filter(
  //       i => i.tipo_de_acolhimento === selectedCategory
  //     ),
  //   // eslint-disable-next-line
  //   [volunteer_organization_id]
  // );

  const onConfirm = () => {
    if (!volunteer_whatsapp)
      return setPopup({
        ...popups,
        noPhoneNumber: true,
        confirm: false
      });
    setPopup({ ...popups, confirm: false });
    return createConnection({ 
      variables: {
        recipientId: individual_user_id,
        volunteerId: volunteer_user_id
      }
    })
  };

  const closeAllPopups = () => {
    setSuccess(false);
    setPopup({
      wrapper: false,
      confirm: false
    });
    return goBack()
  }

  return (
    <FetchUsersByGroup>
      {({ individuals, volunteers }) => {
        const filteredTableData = filterByDistance(
          individuals.data  
        )
        setTable(filteredTableData)
        const user = getUserData({
          user: getQuery(search),
          data: volunteers.data,
          filterBy: "id"
        })
        setVolunteer(user)
        return individuals.data.length === 0 ? (
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
                  <Spacing margin={{ bottom: 20}}>
                    <Flexbox>
                      <StyledButton flat onClick={goBack}>{'< fazer match'}</StyledButton>
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
                  defaultPageSize={10}
                  className="-striped -highlight"
                />
              </Wrap>
            </Flexbox>
            <If condition={wrapper}>
              <Popup
                individualName={individual_name}
                volunteerName={volunteer_name}
                onSubmit={onConfirm}
                isOpen={wrapper}
                onClose={closeAllPopups}
                isLoading={isLoading}
                confirm={{ isEnabled: confirm }}
                success={{
                  link: {
                    individual: () => createWhatsappLink(individual_phone, {
                      volunteer_name: volunteerFirstName,
                      individual_name,
                      agent: "Voluntária",
                      isVolunteer: false
                    }),
                    volunteer: () => createWhatsappLink(volunteer_whatsapp, {
                      volunteer_name: volunteerFirstName,
                      individual_name,
                      agent: "Voluntária",
                      isVolunteer: true
                    }),
                  },
                  isEnabled: success
                }}
                error={{
                  isEnabled: fail,
                  message: error && error.message
                }}
                warning={{
                  isEnabled: noPhoneNumber,
                  id: volunteer_user_id,
                  name: volunteer_name
                }}
              />
            </If>
          </Fragment>
        );
      }}
    </FetchUsersByGroup>
  )
};

export default Table;
