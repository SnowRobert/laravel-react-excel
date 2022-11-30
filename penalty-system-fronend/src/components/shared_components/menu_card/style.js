
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({

    container: {

        padding: theme.spacing(1)
    },

    content: {

      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {

        marginLeft: '25px',
      }
    },
    notifImage: {
      width: theme.spacing(8),
      height: theme.spacing(8),
      
      [theme.breakpoints.down('sm')]: {

        
        width: theme.spacing(5),
        height: theme.spacing(5),
      }
    },
    notifHeader: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: 'rgba(0,0,0,1)',
    },
    
    notifDescription: {

      fontSize: '14px',
    },
    notifTime: {
      fontSize: '12px',
      marginTop: '10px',
    },
  }));