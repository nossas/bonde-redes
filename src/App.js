import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import GoogleMapsAPI from './components/GoogleMapsAPI';
import GoogleSheetAPI from './components/GoogleSheetAPI';

const styles = theme => ({ 
  body: {
    margin: '10px'
  },
  wrapper: {
    display: 'grid',
    height: '100%',
    'grid-template-columns': '1fr 10fr 1fr',
    'grid-template-rows': '1fr',
    'grid-gap': '10px 10px',
    'grid-template-areas': ". . .",
  },
  box: {
    padding: '10px',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

class App extends Component {

  state = {
    address: undefined,
    location: undefined
  }

  render() {
    const { address, location} = this.state;
    const { classes } = this.props;
    return (
    <div className={classes.wrapper}>
      <div className={classes.box}></div>
      <Grid container className={classes.box} spacing={24}>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <Typography className={classes.title} variant="title" color="inherit" noWrap>
                 GeoBonde
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={4}>
          <GoogleMapsAPI
            onSuccess={(values) => {
            this.setState(values)
            }}
          />
        </Grid>
        {address && location && (
        <Grid item xs={8}>
            <Card>
                <CardContent>
                <Typography gutterBottom variant="headline">{address}</Typography>
                <Chip color="primary" avatar={<Avatar>LAT</Avatar>} label={location.lat} />
                <Chip color="primary" avatar={<Avatar>LNG</Avatar>} label={location.lng} />
                </CardContent>
            </Card>
        </Grid>
        )}
        <Grid item xs={12}>
          <GoogleSheetAPI
            point={location ? [location.lng, location.lat] : undefined} />
        </Grid>
      </Grid>
    </div>
    );
  }
}
export default withStyles(styles)(App);
