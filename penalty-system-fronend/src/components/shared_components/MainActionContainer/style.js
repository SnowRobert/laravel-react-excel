import { Button,InputBase } from '@material-ui/core';
import styled from 'styled-components';

import { makeStyles, withStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    root: {

        width: '100%',
        marginTop:  '10px',
        marginBottom: '10px',
        padding: '20px 10px 10px 10px',
        backgroundColor: '#0066ff',
        borderRadius: '10px',
        color: 'white'
    },
    whiteButton: {
        color: 'white'
    },
    iconButton: {
        padding: '8px',
        margin: '3px',
    },
    entries: {

        margin: '0 5px',
        display: 'inline',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },


}));

export const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      margin: '3px',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);



export const ActionButton = styled(Button)`

    width: 120px;
    border-radius: 7px;
    padding: 8px;
    font-size: 10px;
    font-weight: bold;
    margin:5px;

`
