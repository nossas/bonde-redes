import React from 'react';
import Spreadsheet from './Spreadsheet';

class GoogleSheetAPI extends React.Component {
  
  state = {
    loading: false,
    fecthed: false,
    entities: []
  }

  componentDidMount () {
    this.setState({ fetched: false, loading: true });
    fetch('/api')
      .then((res) => {
        res.json().then((values) => {
          console.log('values', values)
          this.setState({ loading: false, fetched: true, entities: values });
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  render () {
    const { loading, entities, fetched } = this.state;
    return (
      <div>
        <h2>
        {`Here should render a SpreadsheetTable: [${loading ? 'loading' : 'done'}]`}
        </h2>
        {fetched && <Spreadsheet point={this.props.point} rows={entities} />}
      </div>
    );
  }
}

export default GoogleSheetAPI;
