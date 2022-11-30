
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({

    root: {

        padding: 0,
        marginTop: '15px',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        height: '500px',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('sm')]: {
            minHeight: '300px',
            height: 'auto',
            maxHeight: '450px',
        }
    },
    header: {
        width : '100%',
        padding: '10px',
        fontWeight: 'bold',
        fontSize: '25px',
        position: 'sticky',
        top: '0',
        zIndex: '10',
        background: '#fff',
    },
    divider: {
        
        marginTop: '10px',
    },
    body: {
        padding: '10px',
    },

  }));