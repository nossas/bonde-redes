import { createStateLink, useStateLinkUnmounted } from '@hookstate/core'

const isSideMenuOpenRef = createStateLink(true)
const isSearchIconPanelOpenRef = createStateLink(false)

const useIsSideMenuOpen = useStateLinkUnmounted(isSideMenuOpenRef)
const useIsSearchIconPanelOpen = useStateLinkUnmounted(isSearchIconPanelOpenRef);

export default {
  isSideMenuOpenRef,
  isSearchIconPanelOpenRef,
  toggleSideMenu: () => useIsSideMenuOpen.set((p) => !p),
  toggleSearchIconPanel: () => useIsSearchIconPanelOpen.set((p) => !p),
}
