import { createStateLink, useStateLinkUnmounted } from '@hookstate/core';

export enum CONTENT_STATE {
  SHOW_MAP = 'mapa',
  SHOW_TABLE = 'tabela'
}

const contentStateRef = createStateLink(CONTENT_STATE.SHOW_TABLE)
const useContentState = useStateLinkUnmounted(contentStateRef)

export default {
  contentStateRef,
  toggleContentState: () => (
    useContentState.value === CONTENT_STATE.SHOW_MAP
      ? useContentState.set(CONTENT_STATE.SHOW_TABLE)
      : useContentState.set(CONTENT_STATE.SHOW_MAP)
  ),
}
