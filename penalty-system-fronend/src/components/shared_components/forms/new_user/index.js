import {Button, Checkbox, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import React, {useState} from 'react'
import {useStyles} from './style'
import BreadCrumb from '../../BreadCrump';
import {signUpTextfields} from '../../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from "react-hook-form";
import {signUpUser} from '../../../../store/reducers/auth/auth.actions';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Close, Label} from '@material-ui/icons';
import {CLEAR_ERROR, CLEAR_MESSAGE, GET_CURRENT_USER} from '../../../../store/reducers/auth/auth.types';
import ProgressLoader from '../../ProgressBarSpinner'
import { Autocomplete } from '@mui/material';
import {userAdminType, departmentType} from '../../../../utils/constants'
import { useEffect } from 'react';
import penaltyDataTypes from '../../../views/penalty/penaltyDataTypes';

export default function NewUserForm(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}} = useForm()
    const navigate = useNavigate()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const authState = useSelector((state) => state.authReducer)
    const currentUser = authState.data;
    const [role, setRole] = useState('');
    const [secretariat, setSecretariat] = useState('');
    const [department, setDepartment] = useState('');
    const [unit, setUnit] = useState('');
    const [departmentList, setDepartmentList] = useState([]);
    const [unitList, setUnitList] = useState([]);

    const onSubmit = (data) => {
        let created_by = currentUser.id;
        let submit = {...data, role, secretariat, department, unit, created_by}
        dispatch(signUpUser(submit, navigate, false))
    }

    console.log('currentUser', currentUser);


    if (authState.message) {
        showSnackBar(authState.message, 'success');
        dispatch({type: CLEAR_MESSAGE})
    }

    if (authState.error) {
        if ("errors" in authState.error) {
            for (const key in authState.error.errors) {

                showSnackBar(authState.error.errors[key]["0"], 'error');

            }
        } else if ("error" in authState.error) {

            showSnackBar(authState.error.error, 'error');
        }
        dispatch({type: CLEAR_ERROR})
    }

    function showSnackBar(msg, variant = 'info') {
        enqueueSnackbar(msg, {
            variant: variant,
            action: (key) => (
                <IconButton style={{color: '#fff'}} size="small" onClick={() => closeSnackbar(key)}>
                    <Close/>
                </IconButton>
            ),
        })
    }

    const links = [
        {
            url: "/ana-sayfa",
            name: "Anasayfa"
        },
        {
            url: "/personel",
            name: "Kullanıcılar"
        },
        {
            url: "/personel-ekle",
            name: "Yeni Kullanıcı Ekle"
        }

    ]

    const handleSecretariatChange = (value) => {
        const _secretariat = penaltyDataTypes.find(item => item.secretariat === value);
        setSecretariat(value);
        setDepartmentList(_secretariat?.departments || [])
        setUnitList([]);
        setDepartment('')
        setUnit('')
    }

    const handleDepartmentChange = (value) => {
        const _department = departmentList.find(item => item.department === value)
        setDepartment(value);
        console.log('_department', _department);
        setUnitList(_department?.subunits || [])
    }

    return (

        <>

            <BreadCrumb links={links}/>
            <Paper className={classes.root}>

                <Typography className={classes.header}>Yeni Kullanıcı Ekle</Typography>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        container
                        spacing={2}
                    >


                        {
                            signUpTextfields.map((item, index) => (

                                <Grid
                                    item
                                    xs={12}
                                    key={index}
                                >

                                    <TextField
                                        required
                                        label={item.placeholder}
                                        placeholder={item.placeholder}
                                        name={item.name}
                                        className={classes.textfield}
                                        fullWidth
                                        type={item.type}
                                        {...register(item.name, {required: true})}
                                    />
                                    {errors[item.name] && <span>Bu alan gereklidir</span>}
                                </Grid>
                            ))
                        }

                        <Grid 
                            item
                            xs={12}
                        >   
                            <InputLabel>Kullanıcı Türü</InputLabel>
                            {
                                currentUser.role == 'SYSTEM_ADMIN' &&(

                                    <Select
                                    fullWidth
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    >
                                        {userAdminType.map((item,index)=>(
                                            <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>  
                                        ))}
                                    </Select>
                                )
                            }
                            

                            {
                                currentUser.role == 'ADMIN' &&(

                                    <Select
                                    fullWidth
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    >
                                        {userAdminType.slice(2, 3).map((item,index)=>(
                                            <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>  
                                        ))}
                                    </Select>
                                )
                            }


                        </Grid>
                        {
                            role != '' && role != 'SYSTEM_ADMIN' &&(
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <InputLabel>Sekreterya</InputLabel>
                                    <Select
                                        fullWidth
                                        id="secretariat"
                                        name="secretariat" 
                                        required = {role == 'SYSTEM_ADMIN' ? false : true}
                                        value={secretariat}
                                        onChange={(e) => handleSecretariatChange(e.target.value)}
                                    >
                                        {penaltyDataTypes.map((item, index)=>(
                                            <MenuItem key={index} value={item.secretariat}>{item.secretariat}</MenuItem>  
                                        ))}
                                    </Select>
                                </Grid>
                            )
                        }

                        {
                            secretariat != '' &&(
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <InputLabel>Departman</InputLabel>
                                    <Select
                                        fullWidth
                                        id="department"
                                        name="department" 
                                        value={department}
                                        onChange={(e) => handleDepartmentChange(e.target.value)}
                                    >                                        
                                        {/* <MenuItem value='0'>Bütün Departmanlar</MenuItem>  */}
                                        {
                                            departmentList && departmentList.length && departmentList.map((item, index)=>(
                                                <MenuItem key={index} value={item.department}>{item.department}</MenuItem>                                          
                                            ))
                                        }
                                    </Select>
                                </Grid>

                            )
                        }

                        {
                            department != '' &&(
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <InputLabel>Şube</InputLabel>
                                    <Select
                                        fullWidth
                                        id="unit"
                                        name="unit" 
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    >
                                        {/* {unitList && unitList.length && unitList.map(item => {
                                            <MenuItem value={item}>{item}</MenuItem>
                                        })} */}

                                        {penaltyDataTypes.map((filter)=>(
                                            filter.secretariat === secretariat && (
                                                filter.departments.map((depart)=>(
                                                    depart.department === department && (
                                                        depart.subunits.map((sub)=>(
                                                            <MenuItem value={sub}>{sub}</MenuItem>
                                                        ))
                                                    )
                                                ))
                                            )
                                        ))}

                                    </Select>
                                </Grid>

                            )
                        }
                    </Grid>

                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={8}>
                            {currentUser && currentUser.role != 'USER' && 
                                (
                                    <Button type="submit" variant="contained" color="primary" className={classes.submitBtn}>
                                        {authState.loading ? <ProgressLoader />: "Kaydet"}
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </>
    );


}
