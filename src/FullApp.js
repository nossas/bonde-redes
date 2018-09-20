import React from 'react'
import Container from './pages/Base'
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

  render () {
    const { showPage } = this.state

    return (
      <Container>
        {showPage === SEARCH && (
          <SearchPage onSuccess={this.handleSuccessForm.bind(this)} />
        )}
        {showPage === SPREADSHEET && (
          <SpreadsheetPage params={this.state.params} />
        )}
      </Container>
    )
  }
}

export default FullAPP
