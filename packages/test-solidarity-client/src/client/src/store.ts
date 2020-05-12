import { createStore } from "easy-peasy";
import GlobalModel from "./models";

const {
  matchFormModel,
  popupModel,
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
  popups: popupModel,
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
