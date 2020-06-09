import { createStore } from "easy-peasy";
import GlobalModel from "./models";

const {
  matchFormModel,
  statusModel,
  geobondeForm,
  tableModel,
  individualModel,
  errorModel,
  fowardModel,
  volunteersModel,
  mapModel
} = GlobalModel;

const storeModel = {
  match: matchFormModel,
  status: statusModel,
  table: tableModel,
  geobonde: geobondeForm,
  individual: individualModel,
  error: errorModel,
  foward: fowardModel,
  volunteers: volunteersModel,
  map: mapModel
};

const store = createStore(storeModel);

export default store;
