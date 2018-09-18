import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import distance from './calcDistance';

const SimpleTable = ({ rows }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>Especialidade</TableCell>
          <TableCell>Localização</TableCell>
          <TableCell>Distância</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.sort((r1, r2) => r1.distance - r2.distance).map((row, index) => (
          <TableRow key={`row-${index}`}>
            <TableCell component='th' scope='row'>
              {`${row.first_name} ${row.last_name}`}
            </TableCell>
            <TableCell>{row.expertness}</TableCell>
            <TableCell>{row.geoAddress}</TableCell>
            <TableCell>{row.distance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

SimpleTable.defaultProps = {
  rows: []
};

export default SimpleTable;
