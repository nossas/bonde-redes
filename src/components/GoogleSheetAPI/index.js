import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Spreadsheet from './Spreadsheet';
import distance from './calcDistance'

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
          this.setState({
            loading: false,
            fetched: true,
            entities: values
          });
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  render () {
    const { loading, entities, fetched } = this.state;
    const { point } = this.props

    const rows = entities.map(value => {
      const distanceBetween = point
        ? distance(point, [value.lng, value.lat])
        : 0;
        return { ...value, distance: distanceBetween };
    })

    return (
      <div>
        {loading ? <CircularProgress size={50} /> : <span></span>}
        {fetched && <Spreadsheet point={point} rows={rows} />}
      </div>
    );
  }
}

export default GoogleSheetAPI;
