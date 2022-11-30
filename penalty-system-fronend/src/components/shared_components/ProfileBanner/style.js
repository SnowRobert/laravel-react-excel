
import { makeStyles } from '@material-ui/core/styles';
import Bg from '../../../images/bg.jpg';




export const useStyles = makeStyles((theme) => ({

    root: {
        width: '80%',
        marginLeft: '10%',
        height: '400px',
        backgroundImage: `url(${Bg})`,
        position : 'relative',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        paddingTop: '70px',
        [theme.breakpoints.down('sm')]: {
            height: '480px',
            width: '100%',
            marginLeft: '0',
        },
    },
    root2: {
        marginTop: '10px',
        width: '80%',
        marginLeft: '10%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: '0',
        },
    },
    overlay: {
        position : 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: '5',
    },
    content: {

        zIndex: '10',
    },
    profile: {

        width: theme.spacing(20),
        height: theme.spacing(20),
        zIndex: '10',
        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        }
    },
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: '#fff',
        zIndex: '10',
        textAlign: 'center',
        marginTop: '10px',
    },
    link: {
        fontSize: '16px',
        color: '#fff',
        zIndex: '10',
        textAlign: 'center',
        marginTop: '10px',

    },
    button: {
        zIndex: '10',
        marginTop: '15px',
        marginLeft: '5px'
    },
    btnLink: {
        color: '#fff',
        textDecoration: 'none',
        textTransform: 'capitalize',
    },

    icon: {
        fontSize: '30px',
    },
    input: {
        display: 'none',
    },
    editContainer: {
        padding: '20px 50px'
    },
    editTitle: {
        padding: '5px 0',
    },
    editDivider: {
        marginBottom: '7px',
    },
    editContent: {
        padding: '10px 0'
    },
    formControl: {
        margin: '10px 5px',
    },
    editBtn: {
        marginTop: '10px',
        marginLeft: '8px',
    }

}))