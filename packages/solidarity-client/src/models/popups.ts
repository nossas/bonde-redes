import { action } from 'easy-peasy';

interface Popups {
  forward: boolean,
  confirm: boolean
  wrapper: boolean
}

const data: Popups = {
  forward: false,
  confirm: false,
  wrapper: false
}

const popupsModel = {
  data,
  setPopup: action((state, payload) => ({
    data: { ...payload }
  }))
};


export default popupsModel
