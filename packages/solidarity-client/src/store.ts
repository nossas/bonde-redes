import { createStore } from 'easy-peasy';
import GlobalModel from './models'

const {
  matchFormModel,
  popupModel,
  geobondeForm,
  tableModel,
  individualModel,
  errorModel
} = GlobalModel

const storeModel = {
  match: matchFormModel,
  popups: popupModel,
  table: tableModel,
  geobonde: geobondeForm,
  individual: individualModel,
  error: errorModel
};

const store = createStore(storeModel);

export default store
