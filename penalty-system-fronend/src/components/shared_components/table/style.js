
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';





export const useStyles = makeStyles({

    
    table: {
      minWidth: '700',
    },
  });
export const StyledTableCell = withStyles((theme) => ({
    head: {
      // backgroundColor: theme.palette.common.black,
      backgroundColor: '#f2f2f2',
      color: theme.palette.common.black,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
export const StyledTableRow = withStyles((theme) => ({
    // root: {
    //   '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    //   },
    // },
  }))(TableRow);