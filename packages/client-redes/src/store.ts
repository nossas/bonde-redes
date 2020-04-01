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
  volunteerModel,
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
  volunteer: volunteerModel,
  map: mapModel
};

const store = createStore(storeModel);

export default store;
