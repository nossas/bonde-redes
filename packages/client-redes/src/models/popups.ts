import { action } from "easy-peasy";

type Popups = {
  confirm: boolean;
  wrapper: boolean;
  noPhoneNumber: boolean;
};

const data: Popups = {
  confirm: false,
  wrapper: false,
  noPhoneNumber: false
};

const popupsModel = {
  data,
  setPopup: action((state, payload) => ({
    data: payload
  }))
};

export default popupsModel;
