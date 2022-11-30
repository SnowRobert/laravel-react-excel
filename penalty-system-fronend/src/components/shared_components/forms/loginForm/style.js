
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    root: {
        width: '30%',
        marginLeft: '35%',
        padding: '20px 50px 50px 50px',
        marginTop: '7%',
        borderRadius: '10px',
        // backgroundColor: 'rgba(230, 245, 255, 0.5)',
        border: "1px solid #d3d3d3",
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: '0',
            padding: '10px',
            marginTop: '0',
            borderRadius: '0',
            boxShadow: 'none',
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    header: {
        padding: '10px 0',
        fontWeight: 'bold',
        fontSize: '27px',
        textAlign: 'center',
    },
    header2: {
        
        textAlign: 'center',
    },
    textfield: {

        marginTop: '3px',
    },
    submitBtn: {
        marginTop: '35px',
    },
    label: {
        fontSize: '16px',
        opacity: '.7',  
    },
    formControl: {

        width: '100%',
    },
    bottomLinks: {
        textAlign: 'center',
        padding: '10px auto',
    }

}))