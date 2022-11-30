import { Avatar, Button, Divider, FormControl, Grid, InputLabel, Link, OutlinedInput, Paper, Typography, IconButton } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useStyles } from './style'
import MailIcon from '@material-ui/icons/Mail';
import { PhotoCamera } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile, getUserDetails, updateProfileImage } from '../../../store/reducers/auth/auth.actions';
import { getUserData } from '../../../store/reducers/users/user.actions';
import ProgressSpinner from '../ProgressBarSpinner';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { useForm } from "react-hook-form";
import { CLEAR_ERROR, CLEAR_MESSAGE } from '../../../store/reducers/auth/auth.types';


export default function ProfileBanner (props) {
    
    const classes = useStyles();
    const { id } = props;
    const dispatch = useDispatch()
    const { register, handleSubmit, formState:{ errors } } = useForm()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const authState = useSelector((state) => state.authReducer)
    const userReducer = useSelector((state) => state.userReducer)
    const reducer = (id.trim().toLowerCase() === 'current-user')?authState:userReducer;

            
      const onSubmit = (data)=> {
        //handleBackdropToggle()
        dispatch(editProfile(data, reducer.data.id))
    }

    const onChange = (event)=> {
        const file = event.target.files['0']
        const formData = new FormData()
        formData.append(
            "profile_picture",
            file,
            file.name
          );
        dispatch(updateProfileImage(formData))
    }

    if(reducer.message) {
      showSnackBar(reducer.message, 'success');
      dispatch({ type: CLEAR_MESSAGE})
  }

  if(reducer.error) {

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
    const editTextField =  [
        {
            placeholder: "Isim",
            name: "name",
            type: "text",
            defaultValue: ("name" in reducer.data)?reducer.data.name: '', 
        },
        
        {
            placeholder: "Soyadı",
            name: "surname",
            type: "text",
            defaultValue: ("surname" in reducer.data)?reducer.data.surname: '', 

        },
    ]
    useEffect(() => {

        if(id.trim().toLowerCase() === 'current-user') {
            //get CURRENT authenticated user details
            dispatch(getUserDetails())
        }else if(!isNaN(id.trim().toLowerCase())) {

            //GET USER DETAILS
            dispatch(getUserData(id))
        }

    }, [])


    return (

        <>

            {
                reducer.loading ?

                    <ProgressSpinner />


                :

                <>
                    <div className={classes.root}>

                    <div className={classes.overlay} />

                        <Grid 
                            container   
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item xs={8} className={classes.content}>
                                <Avatar src={reducer.data.profile_img} className={classes.profile} />

                            </Grid>
                            <Grid item xs={8} className={classes.content}>
                                <Typography className={classes.title}>{reducer.data.name +' '+reducer.data.surname}</Typography>
                            </Grid>
                            <Grid item xs={8} className={classes.content}>
                                <Typography className={classes.link} noWrap>
                                    {reducer.data.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={8} className={classes.content}>
                                <Button 
                                    className={classes.button} 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<MailIcon className={classes.icon} />}
                                >
                                    <Link href={"mailto:"+reducer.data.email} className={classes.btnLink}>
                                        Posta Gönder
                                    </Link>
                                </Button>
                                
                                {

                                    (id.trim().toLowerCase() === 'current-user')?

                                        <>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="profile_image"
                                                multiple
                                                type="file"
                                                onChange={onChange}
                                            />
                                            <label htmlFor="profile_image">
                                                <Button 
                                                    className={classes.button} 
                                                    variant="contained" 
                                                    // color="secondary"
                                                    component="span"
                                                    startIcon={<PhotoCamera className={classes.icon} />}
                                                >
                                                    Yeni Resim Yükle
                                                </Button>
                                            </label>
                                        </>



                                    :
                                    <div></div>
                                }
                                
                            </Grid>
                        </Grid>

                    </div>

                    {
                        
                        (id.trim().toLowerCase() === 'current-user')?

                            <div className={classes.root2}>
                                <Paper className={classes.editContainer}>

                                    <Typography variant="h6"  className={classes.editTitle}>
                                        Hesabı düzenlemek
                                    </Typography>
                                    <Divider  className={classes.editDivider} />
                                    
                                    <Grid container spacing={2} style={{margin: "40px 0"}}>
                                        <Grid item xs={0} md={1}></Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography className={classes.editContent}>
                                                Hesap bilgilerinizi girin. Kullanıcı adınız ve e-postanız herkese açık olarak görüntülenecektir.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={0} md={1}></Grid>
                                        <Grid item xs={12} md={5}>

                                            <form  onSubmit={handleSubmit(onSubmit)}>
                                            
                                                {
                                                    editTextField.map((item, index)=>(

                                                        <FormControl key={index} fullWidth className={classes.formControl} variant="outlined">
                                                            <InputLabel htmlFor="outlined-adornment-amount">{item.placeholder}</InputLabel>
                                                            <OutlinedInput
                                                                id="outlined-adornment-amount"
                                                                placeholder={item.placeholder}
                                                                labelWidth={60}
                                                                type={item.type}
                                                                name={item.name}
                                                                defaultValue={item.defaultValue}
                                                                {...register(item.name, { required: true })}
                                                            />
                                                            {errors[item.name] && <span>Bu alan gereklidir</span>}
                                                        </FormControl>

                                                    ))
                                                }
                                                <Button type="submit" color="primary" variant="contained" className={classes.editBtn}>
                                                    Profili Düzenle
                                                </Button>
                                            
                                                
                                            </form>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </div>
                            

                        :
                        <></>
                    }

                </>
            }
            

        </>
    )
}
