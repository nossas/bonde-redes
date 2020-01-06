import { createStore } from 'easy-peasy';
import GlobalModel from './models'

const {
  volunteerModel,
  agentModel,
  popupModel,
  geobondeForm,
  tableModel,
  individualModel
} = GlobalModel

const storeModel = {
  volunteer: volunteerModel,
  agent: agentModel,
  popups: popupModel,
  table: tableModel,
  geobonde: geobondeForm,
  individual: individualModel
};

const store = createStore(storeModel);

export default store
