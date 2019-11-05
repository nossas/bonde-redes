import React from 'react'
import styled from 'styled-components'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl'
import GlobalContext from 'context'
import { useStateLink } from '@hookstate/core'
import CityPin from './city-pin'

const Map = () => {
  const { table: { tableDataRef, stateViewRef } } = GlobalContext

  const tableData = useStateLink(tableDataRef)
  const state = useStateLink(stateViewRef)
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

  return (
    <>
      <ReactMapGL
        width="100%"
        height="100%"
        {...state.value.viewport}
        onViewportChange={(e) => handleViewportChange(e)}
        mapboxApiAccessToken="pk.eyJ1Ijoicm9saXZlZ2FiIiwiYSI6ImNrMmt0czI5aTAwMnUzY283YmJnNnQwbHAifQ.efIGYzTj4hgD_5Weg1qIQw"
      >
        {(tableData.value as any[]).map((i, indexI) => (
          <Marker key={indexI} latitude={Number(i.latitude)} longitude={Number(i.longitude)}>
            <CityPin size={20} />
          </Marker>
        ))}
        <div style={{ position: 'absolute', bottom: 15, left: 15 }}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    </>
  )
}

export default Map
