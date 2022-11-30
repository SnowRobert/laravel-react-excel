import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StyledTableCell, StyledTableRow,useStyles } from './style';




export default function CustomizedTables(props) {
  const classes = useStyles();
  const { rows, tableHeader } = props;
  
  return (
    // <div></div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>

              {
                  tableHeader.map((item, index)=> {

                    const align = (index === 0)?'':"center";
                    return <StyledTableCell align={align} >{item}</StyledTableCell>
                  })
              }
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item, index) => {

                const cellsData = [];
                let i = 0
                if(Array.isArray(item)) {
                  // item.forEach((__item)=>{
                  //   if(i === 1) {
                      
                  //     cellsData.push(<StyledTableCell  component="th" scope="row" align="center">{index + 1}</StyledTableCell>)
                  //   }
                    
                  //   cellsData.push(<StyledTableCell align="center">{__item}</StyledTableCell>)
                  //   i++
                  // })
                }else {
                  for (const key in item) {
                    
                    if(i === 1) {
                      
                      cellsData.push(<StyledTableCell  component="th" scope="row" align="center">{index + 1}</StyledTableCell>)
                    }
                    
                    cellsData.push(<StyledTableCell align="center">{item[key]}</StyledTableCell>)
                    i++
                  }
                }
                return (
                    <StyledTableRow key={index}>

                        { cellsData }
                    </StyledTableRow>
                );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
