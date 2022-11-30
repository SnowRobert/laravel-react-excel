import { Backdrop, Button, CircularProgress, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import {useStyles} from '../new_vehicle/style';
import BreadCrumb from '../../BreadCrump';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { useDispatch,useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import ProgressSpinner from '../../ProgressBarSpinner'
import { CLEAR_MENU_ERROR, CLEAR_MENU_MESSAGE } from '../../../../store/reducers/menu/menu.types';
import { setNewMenu } from '../../../../store/reducers/menu/menu.actions';


export default function NewMenuForm(props) {

    const classes = useStyles();
    const { handlePageType } = props
    const [menuName, setMenuName] = useState('')
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const dispatch = useDispatch()
    const { register, handleSubmit, formState:{ errors } } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const authReducer = useSelector((state) => state.authReducer)
    const menuReducer = useSelector((state) => state.menuReducer)


    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/kategori/veri", 
            name: "Menü Ekle"
        },
        
    ]

    const handleBackdropClose = () => {
        setOpenBackdrop(false);
      };
      const onSubmit = (data) => {
        setMenuName(data.name)
        if('id' in authReducer.data) {

            dispatch(setNewMenu(data, authReducer.data.id))
        }
        
      };


    if(menuReducer.message) {
        showSnackBar(menuReducer.message.message, 'success');
        dispatch({ type: CLEAR_MENU_MESSAGE})
        if(menuName.trim() !== ''){
            handlePageType(
                {
                    pageType: 'new_menu_fields',
                    menu: menuName,
                    menu_id: menuReducer.message.menu_id
                }
                
            )

        }
    }

    if(menuReducer.error) {

        if("errors" in menuReducer.error) {
            for (const key in menuReducer.error.errors) {

                showSnackBar(menuReducer.error.errors[key]["0"], 'error');
                
            }
        }else if("error" in menuReducer.error) {

            showSnackBar(menuReducer.error.error, 'error');
        }

        
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
            
            <BreadCrumb links={links} />
            <Paper className={classes.root} >

                <Typography className={classes.header}>OGZ CEZA SISTEMI</Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">Menü Ekle</Typography>

                <form  onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        container 
                        spacing={2}
                    >

                            
                        <Grid 
                            item 
                            xs={12}                                
                        >
                            <TextField
                                required 
                                label={"yeni menü"} 
                                placeholder={"yeni menü"}
                                name="name"
                                className= {classes.textfield}
                                fullWidth
                                {...register("name", { required: true })}
                            />
                            {errors["name"] && <span>This field is required</span>}
                        </Grid>                      

                    </Grid>

                    <Grid
                        container            
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={12}>
                            
                            <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} >
                                {
                                    menuReducer.loading?
                                        <ProgressSpinner />
                                    :"Ekle"
                                }
                            </Button>

                        </Grid>
                    </Grid>

                </form>
            </Paper>
            <Backdrop className={classes.backdrop} open={openBackdrop} onClick={handleBackdropClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
    
}
