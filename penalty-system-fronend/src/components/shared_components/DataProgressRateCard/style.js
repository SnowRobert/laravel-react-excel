
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    root: {
        padding: '10px',
    },
    progressBar: {
        margin: '15px 10px 10px 10px'
    },
    icon: {
        fontSize: '30px',
    },
    percentage: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: '10px',
        paddingTop: '28px',
        [theme.breakpoints.down('sm')]: {
            padding: '0',
        },
    },
    header: {
        fontSize: '28px',
        fontWeight: 'bold',
        padding: '5px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
        },
    },
    info: {
        fontSize: '17px',
        fontWeight: 'bold',
        opacity: '0.8',
        padding: '5px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
        },
    }
}))