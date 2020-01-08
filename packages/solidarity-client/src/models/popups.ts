import { action } from 'easy-peasy';

interface Popups {
  confirm: boolean
  wrapper: boolean
}

const data: Popups = {
  confirm: false,
  wrapper: false
}

const popupsModel = {
  data,
  setPopup: action((state, payload) => ({
    data: payload
  }))
};


export default popupsModel
