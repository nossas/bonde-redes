import React, {
  useMemo,
  useCallback,
  Fragment,
  useState,
  useEffect
} from "react";
import "react-table/react-table.css";
import ReactTable from "react-table";
import * as turf from "@turf/turf";
import { useHistory } from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Header as Title } from "bonde-components";

import { encodeText, whatsappText, parseNumber } from "../../../services/utils";
import { StyledButton } from "./style";
import columns from "./columns";
import {
  Popup,
  Confirm,
  Error,
  Success,
  Warning,
  Loading
} from "../../../components";

const Table = () => {
  const volunteer = useStoreState(state => state.match.volunteer);
  const zendeskAgent = useStoreState(state => state.match.agent);
  const zendeskAgentName = useStoreState(state => state.match.assignee_name);

  const status = useStoreState(state => state.status.data);
  const tableData = useStoreState(state => state.table.data);
  const individual = useStoreState(state => state.individual.data);
  const error = useStoreState(state => state.error.error);

  const setStatus = useStoreActions((actions: any) => actions.status.setStatus);
  const setError = useStoreActions((actions: any) => actions.error.setError);
  const fowardTickets = useStoreActions(
    (actions: any) => actions.foward.fowardTickets
  );
  const setTableData = useStoreActions(
    (actions: any) => actions.table.setTable
  );

  const [ticketId, setTicketId] = useState(0);
  const { goBack } = useHistory();

  const {
    name: individual_name,
    ticket_id: individual_ticket_id,
    user_id: individual_user_id
  } = individual;

  const {
    latitude,
    longitude,
    name: volunteer_name,
    whatsapp: volunteer_whatsapp,
    organization_id: volunteer_organization_id,
    phone,
    user_id: volunteer_user_id,
    registration_number: volunteer_registry
  } = volunteer;

  useEffect(() => {
    setTableData([]);
  }, [setTableData]);

  const volunteerFirstName = volunteer_name.split(" ")[0];
  const individualFirstName = individual_name.split(" ")[0];

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

  const filteredTableData = useMemo(() => {
    let data = [];
    if (typeof tableData !== "string") {
      data = filterByDistance(tableData);
    }

    return data;
    // eslint-disable-next-line
  }, [filterByDistance, tableData]);

  const onConfirm = async () => {
    if (!volunteer_whatsapp) return setStatus("noPhoneNumber");
    setStatus("pending");
    const req = await fowardTickets({
      setError,
      data: {
        individual_name,
        individual_ticket_id,
        individual_user_id,
        volunteer_name,
        volunteer_user_id,
        volunteer_registry,
        volunteer_phone: parseNumber(phone.toString() || "0"),
        volunteer_organization_id,
        agent: Number(zendeskAgent),
        assignee_name: zendeskAgentName
      }
    });
    if (req && req.status === 200) {
      setStatus("success");
      return setTicketId(req.data.ticketId);
    }
    return setStatus("rejected");
  };

  const closeAllPopups = () => {
    setError(undefined);
    return setStatus(undefined);
  };

  if (tableData === "pending")
    return <Loading text="Buscando MSR's próximas" />;

  return (
    <>
      <StyledButton dark onClick={goBack}>
        {"< fazer match"}
      </StyledButton>
      {filteredTableData.length === 0 ? (
        <div style={{ height: "calc(100vh - 130px)" }}>
          <Title.h4>Nenhuma MSR próxima foi encontrada.</Title.h4>
        </div>
      ) : (
        <Fragment>
          <div style={{ marginBottom: 20 }}>
            <Title.h4>Match realizado!</Title.h4>
            <Title.h5 color="#444444">
              {`${filteredTableData.length} solicitações de MSRs próximas de ${volunteer_name}`}
            </Title.h5>
          </div>
          <ReactTable
            data={filteredTableData}
            columns={columns}
            defaultPageSize={15}
            className="-striped -highlight"
          />
          <Popup
            individualName={individual_name}
            volunteerName={volunteer_name}
            onSubmit={onConfirm}
            isOpen={typeof status !== "undefined"}
            onClose={closeAllPopups}
          >
            {props => {
              return status === "pending" ? (
                <Loading text="Encaminhando..." />
              ) : (
                <>
                  <Confirm {...props} isEnabled={status === "confirm"} />
                  <Success
                    {...props}
                    link={() =>
                      createWhatsappLink(volunteer_whatsapp, {
                        volunteer_name: volunteerFirstName,
                        individual_name: individualFirstName,
                        agent: zendeskAgentName
                      })
                    }
                    isEnabled={status === "success"}
                    ticketId={ticketId}
                  />
                  <Error
                    {...props}
                    message={error || ""}
                    isEnabled={status === "rejected"}
                  />
                  <Warning
                    {...props}
                    isEnabled={status === "noPhoneNumber"}
                    id={volunteer_user_id}
                    name={volunteer_name}
                  />
                </>
              );
            }}
          </Popup>
        </Fragment>
      )}
    </>
  );
};

export default Table;
