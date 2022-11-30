import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { CLEAR_ERROR, CLEAR_MESSAGE } from '../../store/reducers/auth/auth.types';
import { useDispatch,useSelector } from 'react-redux';
import { resendEmailLink } from '../../store/reducers/auth/auth.actions';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressLoader from '../shared_components/ProgressBarSpinner'


const useStyles = makeStyles((theme) => ({

    root: {
        margin: '10% 0'
    },
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    title: {
        textAlign: 'center',
    }
}))

export default (props) => {

    const { email } = useParams()
    const classes = useStyles()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const authState = useSelector((state) => state.authReducer)

    if(email === '' || email === null || email === undefined) {
        navigate('/auth/login')
    }

    if(parseInt(("verified" in authState.data) && authState.data.verified) === 1 && authState.authenticated) {
        navigate('/ana-sayfa')
    }

    const handleResendLink = ()=> {
        dispatch(resendEmailLink(email))
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

        <div>

            <Grid
                container            
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={4} className={classes.root} >
                    <Typography variant="h2" className={classes.title}>
                        
                        Ogz Ceza Sistemi hoşgeldiniz
                    </Typography>
                    <Typography variant="h6" className={classes.title}>
                        Luften email adresinize gonderilen onay linkini kontrol ediniz
                    </Typography>
                    <Typography variant="h6" className={classes.title} style={{margin: '30px 0'}}>
                        <Button variant="contained" color="primary" onClick={handleResendLink}>
                            {authState.loading?<ProgressLoader />:"E-posta Bağlantısını yeniden gönder"}</Button>
                    </Typography>
                </Grid>
            </Grid>

        </div>

    );
}
