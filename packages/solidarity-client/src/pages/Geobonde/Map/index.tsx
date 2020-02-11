import React from 'react'
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl'
import GlobalContext from '../../../context'
import { useStateLink } from '@hookstate/core'
import { Ticket } from '../../../models/table-data'
import UserPin from './user-pin'
import UserInfo from './user-info'
import { useStoreState } from 'easy-peasy'
const Map = () => {
  const {
    map: { stateViewRef, popupInfoRef }
  } = GlobalContext

  const state = useStateLink(stateViewRef)
  const popupInfo = useStateLink(popupInfoRef)
  const tableData = useStoreState(state => state.table.data)
  const handleViewportChange = ({
    bearing, latitude, longitude, pitch, zoom,
  }: typeof state['value']['viewport']) => {
    state.set({
      viewport: {
        bearing,
        latitude,
        longitude,
        pitch,
        zoom,
      },
    })
  }

  const handleCityPinClick = (user: Ticket) => {
    const { latitude, longitude } = user
    popupInfo.set(prevState => ({
      ...prevState,
      latitude: Number(latitude),
      longitude: Number(longitude),
      open: !prevState.open,
    }))
  }

  const handlePopupClose = () => popupInfo.set(prevState => ({
    ...prevState,
    open: !prevState.open
  }))

  return (
    <>
      <ReactMapGL
        width="100%"
        height="100%"
        {...state.value.viewport}
        onViewportChange={(e) => handleViewportChange(e)}
        mapboxApiAccessToken="pk.eyJ1Ijoicm9saXZlZ2FiIiwiYSI6ImNrMmt0czI5aTAwMnUzY283YmJnNnQwbHAifQ.efIGYzTj4hgD_5Weg1qIQw"
      >
        {(tableData.value).map((i, indexI) => (
          <Marker
            key={indexI}
            latitude={Number(i.latitude)}
            longitude={Number(i.longitude)}
          >
            <UserPin
              size={20}
              onClick={handleCityPinClick}
              user={i}
            />
          </Marker>
        ))}
        {popupInfo.value.open && (
          <Popup
            tipSize={5}
            anchor="top"
            latitude={popupInfo.value.latitude}
            longitude={popupInfo.value.longitude}
            closeOnClick={false}
            onClose={handlePopupClose}
          >
            <UserInfo />
          </Popup>
        )}
        <div style={{ position: 'absolute', bottom: 15, left: 15 }}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    </>
  )
}

export default Map
