import { action } from "easy-peasy";

interface PopupUser {
  latitude: number;
  longitude: number;
  name: string;
  data_de_inscricao_no_bonde: string;
  email: string;
  user_id: number;
  condition: string;
  organization_id: number;
  isOpen: boolean;
}

const popupUser: PopupUser = {
  latitude: 0,
  longitude: 0,
  name: "",
  data_de_inscricao_no_bonde: "",
  email: "",
  user_id: 0,
  condition: "",
  organization_id: 0,
  isOpen: false
};

const mapModel = {
  popupUser,
  setPopupUser: action((state, payload) => ({
    popupUser: payload
  }))
};

export default mapModel;
