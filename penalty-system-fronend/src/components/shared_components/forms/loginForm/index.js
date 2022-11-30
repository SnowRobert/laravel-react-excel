
import { Button,  Paper, Grid, TextField, Typography, Link, IconButton } from '@material-ui/core';
import React from 'react'
import {useStyles} from './style'
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch,useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { loginUser } from '../../../../store/reducers/auth/auth.actions';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { CLEAR_ERROR, CLEAR_MESSAGE } from '../../../../store/reducers/auth/auth.types';
import ProgressLoader from '../../ProgressBarSpinner'

export default function LoginForm(props) {

    const classes = useStyles();
    const dispatch = useDispatch()
    const { register, handleSubmit, formState:{ errors } } = useForm()
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const authState = useSelector((state) => state.authReducer)

    console.log(authState.loading)


    const onSubmit = (data)=> {
        //handleBackdropToggle()
        dispatch(loginUser(data, navigate))
    }

    if(parseInt(("verified" in authState.data) && authState.data.verified) === 1 && authState.authenticated) {
        navigate('/ana-sayfa')
    }

    if(authState.message) {
        showSnackBar(authState.message, 'success');
        dispatch({ type: CLEAR_MESSAGE})
        if(parseInt(("verified" in authState.data) && authState.data.verified) === 0 && authState.authenticated) {
            navigate('/auth/verify-email/'+authState.data.email)
        }
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


    const textFields = [

        {
            placeholder: "E-posta",
            name: "email",
            type: "email"

        },
        {
            placeholder: "Parola",
            name: "password",
            type: "password"

        },
    ]

    return (

        <>

            <Paper className={classes.root} >

                <Typography className={classes.header}>OGZ CEZA SISTEMI</Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">Devam etmek için giriş yapın</Typography>

                <form  onSubmit={handleSubmit(onSubmit)}>

                    <Grid
                        container
                        spacing={2}
                    >


                            {
                                textFields.map((item, index)=>{

                                    const name = item.name
                                    return (

                                        <Grid
                                            item
                                            xs={12}
                                            key={index}
                                        >
                                            <TextField
                                                required
                                                label={item.placeholder}
                                                placeholder={item.placeholder}
                                                type={item.type}
                                                name={name}
                                                className= {classes.textfield}
                                                fullWidth
                                                {...register(name, { required: true })}
                                            />
                                            {errors[name] && <span>This field is required</span>}
                                        </Grid>
                                    )
                                })
                            }

                    </Grid>

                    <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justify="center"
                    >
                        <Grid item xs={12}>
                        
                            <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} >
                                {authState.loading ? <ProgressLoader />: "Oturum aç"}
                            </Button>

                        </Grid>
                        <Grid item xs={12}>
                            <Typography  className={classes.bottomLinks} style={{marginTop: '20px',}}>
                                <Link href={"/auth/forgot-password"}>Parolanızı mı unuttunuz</Link>

                            </Typography>
                            <Typography className={classes.bottomLinks} style={{display: 'none'}}>Henüz üye değil misiniz?</Typography>
                            <Typography  className={classes.bottomLinks} style={{display: 'none'}}>

                                <Link href="/auth/signup">Kaydol</Link>

                            </Typography>

                        </Grid>
                        {/* <Grid item xs={12}>
                            <Typography className={classes.bottomLinks} style={{marginTop: '20px',}}>
                                Bir hesabınız yok mu?
                            </Typography>
                            <Typography  className={classes.bottomLinks}>
                            
                                <Link href="/auth/signup">üye Ol</Link>
                            </Typography>
                        </Grid> */}
                    </Grid>

                </form>
            </Paper>
        </>
    );



}
