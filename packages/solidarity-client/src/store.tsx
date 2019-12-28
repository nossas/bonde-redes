import { createStore } from 'easy-peasy';
import GlobalModel from '../src/models'

const { volunteerModel, agentModel } = GlobalModel

const productsModel = {
  items: {
    1: { id: 1, name: 'Peas', price: 10 }
  }
};

const basketModel = {
  productIds: [1]
};

const storeModel = {
  products: productsModel,
  basket: basketModel,
  volunteer: volunteerModel,
  agent: agentModel
};

const store = createStore(storeModel);

export default store
