
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    root: {
        width: '40%',
        marginLeft: '30%',
        padding: '20px 50px 50px 50px',
        // backgroundColor: 'rgba(230, 245, 255, 0.5)',
        border: "1px solid #d3d3d3",
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: '0',
            padding: '10px',
        }
    },
    root1: {
        width: '80%',
        marginLeft: '10%',
        padding: '10px',
        boxShadow: 'none',
        // backgroundColor: 'rgba(230, 245, 255, 0.5)',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: '0',
        }
    },
    header: {
        padding: '10px 0',
        fontWeight: 'bold',
        fontSize: '27px',
        textAlign: 'center',
    },
    textfield: {

        marginTop: '3px',
    },
    submitBtn: {
        marginTop: '35px',
        marginRight: '5px',
    },

}))