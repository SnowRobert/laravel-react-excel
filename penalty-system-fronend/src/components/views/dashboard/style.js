
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    chartCanvas: {

        margin: '10px',
        height: '550px',
        width: '95%',
        padding: '20px',
        
        [theme.breakpoints.down('sm')]: {
            height: '400px',
            width: '96%',
            padding: '5px',
            margin: '3px',
            marginTop: '10px'
        },
    },

    header: {
        padding: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        [theme.breakpoints.down('sm')]: {
            
            fontSize: '14px',
        },
    },
    notificationCard: {

        width: '100%',
        
    },
    calendar: {

        height: '350px',
    },

}))