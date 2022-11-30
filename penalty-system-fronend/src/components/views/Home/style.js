
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({

    root: {
        width: '95%',
        padding: '20px 20px 20px 5%',
        [theme.breakpoints.down('sm')]: {
            width: '93%',
            margin: '0',
            marginLeft: '3px',
        }
    }

}))