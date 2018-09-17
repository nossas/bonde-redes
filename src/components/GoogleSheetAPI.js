import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const SimpleTable = ({ rows }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>Sobrenome</TableCell>
          <TableCell>Cidade</TableCell>
          <TableCell>UF</TableCell>
          <TableCell>Especialidade</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={`row-${index}`}>
            <TableCell component='th' scope='row'>{row.first_name}</TableCell>
            <TableCell>{row.last_name}</TableCell>
            <TableCell>{row.city}</TableCell>
            <TableCell>{row.state}</TableCell>
            <TableCell>{row.expertness}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

SimpleTable.defaultProps = {
  rows: []
};

class GoogleSheetAPI extends React.Component {
  
  state = {
    loading: false,
    fecthed: false,
    entities: []
  }

  componentDidMount () {
    this.setState({ fetched: false, loading: true });
    fetch('http://localhost:4000')
      .then((res) => {
        res.json().then((values) => {
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
        {fetched && <SimpleTable rows={entities} />}
      </div>
    );
  }
}

export default GoogleSheetAPI;
