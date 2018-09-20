import React from 'react'
import {
  Header,
  Title,
  Page,
  Footer,
  Button,
  Flexbox2 as Flexbox
} from 'bonde-styleguide'
import SearchPage from './pages/Search'
import SpreadsheetPage from './pages/Spreadsheet'

const SEARCH = 'search'
const SPREADSHEET = 'spreadsheet'

class FullAPP extends React.Component { 

  state = {
    params: {},
    showPage: SEARCH
  }

  handleSuccessForm (params) {
    this.setState({ params, showPage: SPREADSHEET })
  }

  handleBackward () {
    this.setState({ showPage: SEARCH, params: {} })
  }

  render () {
    const { showPage } = this.state

    return (
      <React.Fragment>
        <Header>
          <Flexbox spacing='between'>
            <Title.H2 color='white'>Mapa do acolhimento</Title.H2>
            {showPage === SPREADSHEET && (
              <Button onClick={this.handleBackward.bind(this)}>
                Fazer nova busca
              </Button>
            )}
          </Flexbox>
        </Header>
        <Page>
          {showPage === SEARCH && (
            <SearchPage onSuccess={this.handleSuccessForm.bind(this)} />
          )}
          {showPage === SPREADSHEET && (
            <SpreadsheetPage params={this.state.params} />
          )}
        </Page>
        <Footer />
      </React.Fragment>
    )
  }
}

export default FullAPP
