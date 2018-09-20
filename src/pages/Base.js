import React from 'react'
import {
  Header,
  Title,
  Page,
  Footer,
  Button,
  Flexbox2 as Flexbox
} from 'bonde-styleguide'

const Base = ({ children }) => (
  <React.Fragment>
    <Header>
      <Flexbox spacing='between'>
        <Title.H2 color='white'>Mapa do acolhimento</Title.H2>
        <Button onClick={() => { window.location.reload() }}>
          Fazer nova busca
        </Button>
      </Flexbox>
    </Header>
    <Page>
      {children}
    </Page>
    <Footer />
  </React.Fragment>
)

export default Base
