import {
    Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography,
    Checkbox, FormControlLabel, FormGroup, FormLabel
} from '@material-ui/core';
import React, {forwardRef, useEffect, useState} from 'react'
import {useStyles} from './style'
import BreadCrumb from '../../BreadCrump';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Close} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProgressSpinner from '../../ProgressBarSpinner'
import {
    getAllVehiclesPlateNumber,
    setNewVehicle,
    updateVehicle
} from '../../../../store/reducers/vehicle/vehicle.actions';
import {handleUpdateData, formatDate, removeNulls} from '../../../../utils/functions'
import {vehicleSelectFields} from '../../../../utils/constants'
import {vehicleTextFields} from '../../../../utils/constants'
import {CLEAR_VEHICLE_ERROR, CLEAR_VEHICLE_MESSAGE} from '../../../../store/reducers/vehicle/vehicle.types';

export default function NewVehicleForm(props) {

    const {isUpdate, data} = props;
    const [formData, setFormData] = useState(data);
    const classes = useStyles();
    const dispatch = useDispatch()
    const defaultInputData = (data !== null && data !== undefined) ? data : {}
    const [formInputData, setFormInputData] = useState({})
    const [equipments, setEquipments] = useState(
        ("equipment" in defaultInputData) ? defaultInputData.equipment : ""
    )
    const navigate = useNavigate()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const vehicleReducer = useSelector((state) => state.vehicleReducer)
    const authReducer = useSelector((state) => state.authReducer)
    const currentUser = authReducer.data;
    const textFields = vehicleTextFields


    useEffect(() => {
        console.log('changed-form-data-2:', data);
        setFormData(data);
    }, [data, isUpdate])

    const links = [
        {
            url: "/ana-sayfa",
            name: "Anasayfa"
        },
        {
            url: "/arac",
            name: "araç"
        },
        {
            url: "/arac-ekle",
            name: "yeni araç ekle"
        }

    ]


    const checkboxInput = [
        "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6"
    ]


    const handleInputChange = (inputName, inputValue) => {
        const data = formInputData
        data[inputName] = inputValue
        setFormInputData(data)
    }

    const handleCheckBoxChange = (e) => {

        const value = e.target.value.trim()
        let equipment__ = equipments
        if (equipment__ !== "") {

            const __equipmentsArray = equipment__.split(',')
            //if value is in data remove else add to data
            if (__equipmentsArray.includes(value)) {

                const index = __equipmentsArray.indexOf(value)
                if (index > -1) {
                    __equipmentsArray.splice(index, 1)
                }
            } else {

                __equipmentsArray.push(value)
            }
            equipment__ = __equipmentsArray.join()
        } else {
            equipment__ = [value].join()
        }
        setEquipments(equipment__)

    }

    const isCheckBoxChecked = (value) => {

        console.log(value)
        console.log(equipments)
        return equipments.split(',').includes(value)

    }


    const onSubmit = (e) => {
        e.preventDefault()
        let data = formInputData

        if (data === {} && defaultInputData !== {}) {
            showSnackBar("No data has been editted", "info")
            return
        } else if (data !== {} && defaultInputData !== {}) {

            //if the state is not empty and there are default values,
            //then add un-updated-default-values to data
            const __defaultInputData = handleUpdateData(defaultInputData)
            for (const key in __defaultInputData) {

                if (!(key in data)) {
                    data[key] = __defaultInputData[key]
                }

            }
        } else if (data === {} && defaultInputData === {}) {
            showSnackBar("Cannot add empty fields ", "error")
            return
        }

        if (equipments !== "") {
            data["equipment"] = equipments
        }

        if ('id' in authReducer.data) {

            if (isUpdate) {
                dispatch(updateVehicle(removeNulls(data), authReducer.data.id, defaultInputData.id))
            } else {
                dispatch(setNewVehicle(data, authReducer.data.id, navigate))
            }
        }
    }

    if (vehicleReducer.message) {
        showSnackBar(vehicleReducer.message, 'success');
        dispatch({type: CLEAR_VEHICLE_MESSAGE})
    }

    if (vehicleReducer.error) {

        if ("errors" in vehicleReducer.error) {
            for (const key in vehicleReducer.error.errors) {

                showSnackBar(vehicleReducer.error.errors[key]["0"], 'error');

            }
        } else if ("error" in vehicleReducer.error) {

            showSnackBar(vehicleReducer.error.error, 'error');
        }


        dispatch({type: CLEAR_VEHICLE_ERROR})
    }


    const getTextInputValue = (name) => {
        return (formData !== null && formData !== undefined) ? formData[name] : ''
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


    const ExampleCustomInput = forwardRef(
        ({value, onClick, name}, ref) => (

            <TextField
                ref={ref}
                value={value}
                onClick={onClick}
                className={classes.textfield}
                fullWidth
                name={name}

            />
        ),
    );

    return (

        <>
            {
                isUpdate ?
                    <></>
                    :
                    <BreadCrumb links={links}/>
            }
            <Paper className={isUpdate ? classes.root1 : classes.root}>

                <Typography
                    className={classes.header}>{isUpdate ? "aracı düzenle".toUpperCase() : "yeni araç ekle".toUpperCase()}</Typography>

                <form onSubmit={onSubmit}>
                    <Grid
                        container
                        spacing={2}
                    >


                        {
                            textFields.map((item, index) => (

                                <Grid
                                    item
                                    xs={12}
                                    key={index}
                                >
                                    <TextField
                                        key={formData ? formData.id + '-' + index : index}
                                        type="text"
                                        label={item.placeholder}
                                        placeholder={item.placeholder}
                                        name={item.name}
                                        className={classes.textfield}
                                        fullWidth
                                        value={formInputData[item.name]}
                                        defaultValue={getTextInputValue(item.name)}
                                        // {...register(item.name, { required: true })}
                                        onChange={(e) => handleInputChange(item.name, e.target.value)}
                                    />
                                    {/* {errors[item.name] && <span>This field is required</span>} */}
                                </Grid>
                            ))
                        }


                        {


                            vehicleSelectFields.map((item, index) => (


                                <Grid
                                    item
                                    xs={12}
                                >
                                    <FormControl style={{width: '100%'}}>
                                        <InputLabel id="demo-simple-select-label">{item.label}</InputLabel>
                                        <Select
                                            key={formData ? formData.id + '-s' + index : 's' + index}
                                            name={item.name}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={(e) => handleInputChange(item.name, e.target.value)}
                                            value={formInputData.status}
                                            defaultValue={getTextInputValue(item.name)}
                                        >

                                            {
                                                item.menuItem.map((element, index) => (
                                                    <MenuItem key={index}
                                                              value={element.value}>{element.value}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {/* {errors["status"] && <span>This field is required</span>} */}
                                    </FormControl>
                                </Grid>


                            ))


                        }


                        <Grid item xs={12}>

                            <FormControl component="fieldset">
                                <FormLabel component="legend">Araç ekipmanları</FormLabel>
                                <FormGroup row>


                                    {

                                        checkboxInput.map((item, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        key={formData ? formData.id + '-c' + index : 'c' + index}
                                                        value={item}
                                                        name={"checked" + index}
                                                        onChange={handleCheckBoxChange}
                                                        checked={isCheckBoxChecked(item)}
                                                    />
                                                }
                                                label={item}
                                            />
                                        ))

                                    }
                                </FormGroup>
                            </FormControl>

                        </Grid>


                    </Grid>

                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={8}>
                            {
                                currentUser && currentUser.role != 'USER' && 
                                (
                                    <Button type="submit" variant="contained" color="primary" className={classes.submitBtn}>
                                        {
                                            vehicleReducer.loading ? <ProgressSpinner/> : "araç ekle"
                                        }
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
