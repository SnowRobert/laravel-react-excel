import {  Box, Button, Divider, Grid, IconButton, Typography } from '@material-ui/core'
import { Close, Delete } from '@material-ui/icons';
import React from 'react';
import { useStyles } from './style';
import { useDispatch, useSelector } from 'react-redux';
import ProgressSpinner from '../ProgressBarSpinner'
import { deleteMenu } from '../../../store/reducers/menu/menu.actions';
import { useSnackbar } from 'notistack';
import { CLEAR_MENU_ERROR, CLEAR_MENU_MESSAGE } from '../../../store/reducers/menu/menu.types';

export default function MenuCard(props) {

    const classes = useStyles();
    const {menu_id, menu_name, created_at} = props
    const dispatch = useDispatch()
    const menuReducer = useSelector(state => state.menuReducer)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleMenuDelete = () => {
        dispatch(deleteMenu(1, menu_id))
    }

    if(menuReducer.message) {
        showSnackBar(menuReducer.message, 'success');
        dispatch({ type: CLEAR_MENU_MESSAGE})
    }

    if(menuReducer.error) {
        
        showSnackBar(menuReducer.error, 'error');
        dispatch({ type: CLEAR_MENU_ERROR})
    }

      function showSnackBar(msg, variant = 'info'){
        enqueueSnackbar(msg, {
            variant: variant,            
            action: (key) => (
                <IconButton style={{color: '#fff'}} size="small" onClick={() => closeSnackbar(key)}>
                    <Close />
                </IconButton>
            ),
        })
    }
    
    return (

        <>
        
            <Grid container className={classes.container}>

                
                <Grid xs={7} md={8} item className={classes.content}>
                    <Box>
                        <Typography className={classes.notifHeader} >{menu_name}</Typography>
                        <Typography className={classes.notifTime}>oluşturulduğunda: {created_at} </Typography>
                    </Box>
                </Grid>
                <Grid xs={2} md={3} item >

                    <Grid 
                        container           
                        direction="column"
                        alignItems="center"
                        justify="center"
                        
                    >

                        <Grid item xs={12}>

                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={menuReducer.loading? "": <Delete /> }
                                onClick={handleMenuDelete}
                            >
                                {menuReducer.loading?<ProgressSpinner/> : "Sil"}
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


            <Divider />

        </>
    );

}
