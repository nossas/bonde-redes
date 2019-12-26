import { createStore } from 'easy-peasy';

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
  basket: basketModel
};

const store = createStore(storeModel);

export default store
