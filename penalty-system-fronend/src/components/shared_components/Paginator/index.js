import { Grid, Typography } from '@material-ui/core';
import React from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { useStyles } from './style';

export default function Paginator (props) {
    
    const classes = useStyles();
    const { page,paginationCount, handlePagination } = props
    const handleChange = (event, value) => {
      handlePagination(value)
    };

    
    return (

        <div className={classes.root}>
            <Grid 
                container
                className={classes.paginator}
            >

                <Grid item xs={12} md={8} style={{padding: '7px 0'}} >

                    <Typography variant="small">Sayfa: {page}/{paginationCount} </Typography>

                </Grid>
                <Grid item xs={12} md={4} >

                    <Pagination count={paginationCount}  page={page} onChange={handleChange}/>
                </Grid>

            </Grid> 
        </div>
    );
}
