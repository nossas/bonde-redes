import React, {
  useMemo,
  useCallback,
  Fragment,
  useState,
} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import * as turf from "@turf/turf";
import { useHistory } from "react-router-dom";
import { Flexbox2 as Flexbox, Title, Spacing } from "bonde-styleguide";
import { useStoreState, useStoreActions } from "easy-peasy";

import {
  encodeText,
  whatsappText,
  parseNumber,
} from "../../services/utils";
import { Wrap, StyledButton } from "./style";
import columns from "./columns";

import { If } from "../../components/If";
import Popup from "../../components/Popups/Popup";

const Table = () => {
  const { goBack } = useHistory()

  const setPopup = useStoreActions(actions => actions.popups.setPopup);
  const setError = useStoreActions(actions => actions.error.setError);
  const fowardTickets = useStoreActions(
    actions => actions.foward.fowardTickets
  );

  const tableData = useStoreState(state => state.table.data);
  const individual = useStoreState(state => state.individual.data);
  const volunteer = useStoreState(state => state.volunteer.data);

  const popups = useStoreState(state => state.popups.data);
  const error = useStoreState(state => state.error.error);

  const [success, setSuccess] = useState(false);
  const [isLoading, setLoader] = useState(false);

  const { confirm, wrapper, noPhoneNumber } = popups;
  const { name: individual_name, phone: individual_phone, id: individual_user_id } = individual;
  const {
    latitude,
    longitude,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    phone,
    id: volunteer_user_id,
  } = volunteer;

  const volunteerFirstName = volunteer_name.split(" ")[0];
  // const selectedCategory = volunteer_category(volunteer_organization_id);
  const distance = 50;
  const lat = Number(latitude);
  const lng = Number(longitude);

  const createWhatsappLink = (number, textVariables) => {
    if (!number) return "";
    const whatsappphonenumber = parseNumber(number);
    const urlencodedtext = encodeText(whatsappText(textVariables));
    return `https://api.whatsapp.com/send?phone=55${whatsappphonenumber}&text=${urlencodedtext}`;
  };

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

  const filteredTableData = useMemo(() => {
    const data = filterByDistance(
      tableData.individual
    )
    return data
    // eslint-disable-next-line
  }, [tableData]);

  const submitConfirm = async requestBody => {
    const req = await fowardTickets({
      setError,
      setSuccess,
      data: requestBody
    });
    if (req && req.status === 200) {
      setLoader(false);
    }
  };

  const onConfirm = () => {
    if (!volunteer_whatsapp)
      return setPopup({
        ...popups,
        noPhoneNumber: true,
        confirm: false
      });
    setPopup({ ...popups, confirm: false });
    setLoader(true);
    return submitConfirm({
      individual_name,
      individual_user_id,
      volunteer_name,
      volunteer_user_id,
      volunteer_phone: Number(parseNumber(phone || 0)),
    });
  };

  const closeAllPopups = () => {
    setError({
      status: false,
      message: ""
    });
    setSuccess(false);
    setPopup({
      wrapper: false,
      confirm: false
    });
    return goBack()
  };

  return filteredTableData.length === 0 ? (
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
          confirm={{
            onClose: closeAllPopups,
            onSubmit: onConfirm,
            isEnabled: confirm
          }}
          success={{
            onClose: closeAllPopups,
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
  );
};

export default Table;
