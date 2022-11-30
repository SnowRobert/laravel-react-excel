
import { Button,  Paper, Grid, TextField, Typography, IconButton } from '@material-ui/core';
import React, { useState } from 'react'
import {useStyles} from '../loginForm/style'
import { useDispatch,useSelector } from 'react-redux'
import { CLEAR_ERROR, CLEAR_MESSAGE } from '../../../../store/reducers/auth/auth.types';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../../../store/reducers/auth/auth.actions';
import { Close } from '@material-ui/icons';
import ProgressLoader from '../../ProgressBarSpinner'

export default function NewPassword(props) {

    const { token } = useParams()
    const classes = useStyles();
    const navigate = useNavigate()
    const [formInput, setFormInput] = useState({})
    const dispatch = useDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const authState = useSelector((state) => state.authReducer)
    const email = localStorage.getItem("email")

    if(token === "" || token === null || token === undefined || email === '' || email === null || email === undefined) {
        showSnackBar('geçersiz belirteç ve e-posta sağlandı', 'error')
        navigate('/auth/forgot-password')
    }


    const textFields = [
        
        
        {
            placeholder: "parola",
            name: "password",
            type: "password"

        },
        
        {
            placeholder: "Şifreyi Onayla",
            name: "password_confirmation",
            type: "password"

        },
    ]

    
    const handleInputChange = (inputName, inputValue)=> {
        const __data = formInput
        __data[inputName] = inputValue
        setFormInput( __data )
    }

    
    const handleSubmit = (e) => {
        e.preventDefault()
        if(setFormInput === {}) {
            showSnackBar("E-posta alanı gerekli", "error")
            return
        }

        
    console.log(email)
    console.log(token)
    console.log(formInput.password)
    console.log(formInput.password_confirmation)
        //checking email
        const formData = new FormData()
        formData.append('email', email.trim().toLowerCase());
        formData.append('password', formInput.password);
        formData.append('password_confirmation', formInput.password_confirmation);
        formData.append('token', token);
        dispatch(forgotPassword(formData, navigate))

    }

    
    if(authState.message) {
        showSnackBar(authState.message, 'success');
        dispatch({ type: CLEAR_MESSAGE})
    }

    if(authState.error) {
        if("errors" in authState.error) {
            for (const key in authState.error.errors) {

                showSnackBar(authState.error.errors[key]["0"], 'error');
                
            }
        }else if("error" in authState.error) {

            showSnackBar(authState.error.error, 'error');
        }
        dispatch({ type: CLEAR_ERROR})
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
            
            <Paper className={classes.root} >

                <Typography className={classes.header}>OGZ CEZA SISTEMI</Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">Yeni Şifreyi Girin</Typography>

                
                <form onSubmit={handleSubmit}>
                    <Grid 
                        container 
                        spacing={2}
                    >

                            
                            {
                                textFields.map((item, index)=>(

                                    <Grid 
                                        item 
                                        xs={12}
                                        key={index}                                
                                    >
                                        <TextField 
                                            required 
                                            label={item.placeholder} 
                                            type={item.type} 
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            className= {classes.textfield}
                                            fullWidth
                                            value={formInput[item.name.trim()]}
                                            onChange={(e)=>handleInputChange(item.name.trim(), e.target.value)}
                                        />
                                    </Grid>
                                ))
                            }                      

                    </Grid>

                    <Grid
                            container            
                            direction="column"
                            alignItems="center"
                            justify="center"
                    >
                        <Grid item xs={8}>
                            <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} >
                                {authState.loading ? <ProgressLoader />:"Kaydet"}
                            </Button>

                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </>
    );


    
}
