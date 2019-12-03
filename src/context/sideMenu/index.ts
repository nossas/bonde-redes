import { createStateLink } from '@hookstate/core'

const isSideMenuOpenRef = createStateLink(true)
const isSearchIconPanelOpenRef = createStateLink(false)

export default {
  isSideMenuOpenRef,
  isSearchIconPanelOpenRef,
}
