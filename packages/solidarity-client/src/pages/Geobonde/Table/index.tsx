import React, { useMemo, useCallback, useEffect } from "react";
import ReactTable from "react-table";
import { Header } from "bonde-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import * as turf from "@turf/turf";

import { Ticket } from "../../../types";
import columns from "./columns";
import { zendeskOrganizations, isVolunteer } from "../../../services/utils";

import { Loading } from "../../../components";

import "react-table/react-table.css";

const Table: React.FC = () => {
  const tableData = useStoreState(state => state.table.data);
  const searchForm = useStoreState(state => state.geobonde.form);
  const getTableData = useStoreActions(
    (actions: any) => actions.table.getTableData
  );

  useEffect(() => {
    getTableData({ endpoint: "all" });
  }, [getTableData]);

  const { distance, lat, lng, individual, lawyer, therapist } = searchForm;

  const filterByDistance = useCallback(
    (data: Ticket[]) =>
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

  const filterByCategory = useCallback(
    (data: Ticket[]) =>
      data.filter(i => {
        if (i.organization_id === zendeskOrganizations.therapist) {
          if (!therapist) {
            return false;
          }
        } else if (i.organization_id === zendeskOrganizations.lawyer) {
          if (!lawyer) {
            return false;
          }
        } else if (i.organization_id === zendeskOrganizations.individual) {
          if (!individual) {
            return false;
          }
        }

        return true;
        // eslint-disable-next-line
      }),
    [individual, lawyer, therapist]
  );

  const filterByUserCondition = useCallback(
    (data: Ticket[]) =>
      data.filter(i => {
        if (isVolunteer(i.organization_id)) {
          switch (i.condition) {
            case "disponivel":
              return true;
            case "aprovada":
              return true;
            case "desabilitada":
              return true;
            default:
              return false;
          }
        } else if (!isVolunteer(i.organization_id)) return true;
        return false;
      }),
    []
  );

  const filteredTableData = useMemo(() => {
    let data: Array<any> = [];
    if (typeof tableData !== "string") {
      data = filterByCategory(
        filterByDistance(filterByUserCondition(tableData))
      );
    }

    return data;
  }, [filterByCategory, filterByDistance, filterByUserCondition, tableData]);

  if (tableData === "pending") return <Loading text="Buscando..." />;

  return filteredTableData.length === 0 ? (
    <div style={{ height: "calc(100vh - 130px)" }}>
      <Header.h3 style={{ margin: 30 }}>Nenhum resultado.</Header.h3>
    </div>
  ) : (
    <>
      <Header.h3 style={{ marginBottom: 10 }}>Usuárias encontradas!</Header.h3>
      <Header.h5>
        {`${filteredTableData.length} usuárias encontradas em um raio de ${distance}km.`}
      </Header.h5>
      <br />
      <ReactTable
        data={filteredTableData}
        columns={columns}
        defaultPageSize={15}
        className="-striped -highlight"
      />
    </>
  );
};

export default Table;
