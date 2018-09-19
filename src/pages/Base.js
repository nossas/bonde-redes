import React from 'react'
import { Header, Title, Page } from 'bonde-styleguide'

const Base = ({ children }) => (
  <React.Fragment>
    <Header>
      <Title.H2 color='white'>Mapa do acolhimento</Title.H2>
    </Header>
    <Page>
      {children}
    </Page>
  </React.Fragment>
)

export default Base
