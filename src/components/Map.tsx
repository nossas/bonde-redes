import React, { useEffect } from 'react'
import styled from 'styled-components'

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

const Map = () => {
  useEffect(() => {
    window.MyNamespace = () => {
      // console.log('EITCHA!')
    }
  }, [])

  const { REACT_APP_GOOGLE_CLIENT_KEY } = process.env

  return (
    <>
      <script src={`https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_CLIENT_KEY}&callback=initMap`} />
      <MapWrapper />
    </>
  )
}

export default Map
