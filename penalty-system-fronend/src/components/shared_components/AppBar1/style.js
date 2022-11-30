
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    list: {
        width: 250,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'inline-block',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    menu_items_container: {
      margin: '0 10px',
      display: 'inline',
        
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    button: {
        marginLeft: '15px',
        color: '#000 !important',
        '&:hover': {
          backgroundColor: '#f2f2f2',
          border: 'none',
          boxShadow: 'none',
          textDecoration: 'none'
        },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    sideMenuHeader: { 
        textAlign: 'center',
        padding: '15px 0'
    },
    divider: {
        marginBottom: '10px',
    }, 
    closeIcon: {
        marginLeft: '20px',
    }
  }));