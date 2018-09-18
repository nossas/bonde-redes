import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import distance from './calcDistance';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

const createTableCell = ({ maxWidth }) => withStyles(theme => ({
  body: {
    wordBreak: 'break-word',
    maxWidth: maxWidth
  },
}))(TableCell);

const ExpertnessTableCell = createTableCell({ maxWidth: '300px' });
const AvailabilityTableCell = createTableCell({ maxWidth: '200px' });
const GeoAddressTableCell = createTableCell({ maxWidth: '400px' });

const SimpleTable = ({ rows, classes }) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>Especialidade</TableCell>
          <TableCell>Localização</TableCell>
          <TableCell>Distância</TableCell>
          <TableCell>Quantas pessoas pode atender</TableCell>
          <TableCell>Está atendendo</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.sort((r1, r2) => r1.distance - r2.distance).map((row, index) => (
          <TableRow key={`row-${index}`}>
            <TableCell component='th' scope='row'>
              {`${row.first_name} ${row.last_name}`}
            </TableCell>
            <ExpertnessTableCell>{row.expertness}</ExpertnessTableCell>
            <GeoAddressTableCell>{row.geoAddress}</GeoAddressTableCell>
            <TableCell>{row.distance}</TableCell>
            <AvailabilityTableCell>{row.availability}</AvailabilityTableCell>
            <TableCell>{row.busy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

SimpleTable.defaultProps = {
  rows: []
};

export default withStyles(styles)(SimpleTable);
