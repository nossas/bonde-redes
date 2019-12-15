import { createStateLink } from '@hookstate/core';

interface Popups {
  forward: boolean,
  confirm: boolean
  wrapper: boolean
}

const popupsRef = createStateLink<Popups>({
  forward: false,
  confirm: false,
  wrapper: false
})


export default {
  popupsRef,
}
