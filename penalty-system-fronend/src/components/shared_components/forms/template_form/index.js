
import { Button,  Paper, Grid, TextField, Typography, IconButton, FormControl } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useStyles} from '../new_vehicle/style'
import "react-datepicker/dist/react-datepicker.css";
import { Close } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import {DropzoneArea} from 'material-ui-dropzone'
import BreadCrumb from '../../BreadCrump';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import ProgressSpinner from '../../ProgressBarSpinner'
import { getAllVehiclesPlateNumber } from '../../../../store/reducers/vehicle/vehicle.actions';
import { getAllMenuEntries } from '../../../../store/reducers/menu/menu.actions';
import { setNewMenuData, updateMenuData } from '../../../../store/reducers/menu_data/menu_data.actions';
import { CLEAR_MENU_DATA_ERROR, CLEAR_MENU_DATA_MESSAGE } from '../../../../store/reducers/menu_data/menu_data.types';
import { removeNulls } from '../../../../utils/functions'


export default function TemplateForm (props) {

    const { isUpdate, title, data } = props;
    const incomingData = data?data:{}
    const classes = useStyles();
    const [defaultInputData, setDefaultInputData] =  useState(("data" in incomingData)?JSON.parse(incomingData.data):{})
    const [formInputData, setFormInputData] = useState({})
    const [uKey, setUKey] = useState('1');
    const [plateNumber, setPlateNumber] = useState(
        ("vehicle" in incomingData)?{
            id: incomingData.vehicle.id,
            plate_number: incomingData.vehicle.plate_number
        }:{}
    );
    const [uploadedPdf, setUploadedPdf] = useState(null)
    const [fileError, setFileError] = useState('')
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // const { register,handleSubmit, formState:{ errors } } = useForm()
    const authReducer = useSelector((state) => state.authReducer)
    const menuReducer = useSelector((state) => state.menuReducer)
    const vehicleReducer = useSelector((state) => state.vehicleReducer)
    const menuDataReducer = useSelector((state) => state.menuDataReducer)
    const menu_id = localStorage.getItem("menu_id")

    useEffect(() => {

        dispatch(getAllMenuEntries(menu_id))
    }, [true])

    useEffect(() => {

        dispatch(getAllVehiclesPlateNumber())
    }, [true])

    useEffect(() => {
        if(!menu_id) {
            showSnackBar('Sorry invalid data provided, contact admin for more info', 'error')
            navigate('/ana-sayfa')
        }
    }, [true])

    useEffect(() => {
        console.log('changed-form-data-2:', data);
        setDefaultInputData(("data" in data)?JSON.parse(data.data):{});
        setUKey(new Date().getTime() + '');
    }, [data, isUpdate])


    const handleFileChange = (files) => {
        setUploadedPdf(files["0"])
    }


    const handleInputChange = (inputName, inputValue)=> {
        const data = formInputData
        data[inputName.trim()] = inputValue
        setFormInputData(data)
    }
    const onSubmit = (e)=> {
        e.preventDefault()
        let data = formInputData
        if(data === {} && defaultInputData !== {}){
            showSnackBar("No data has been editted", "info")
            return
        }else if(data !== {} && defaultInputData !== {}){

            //if the state is not empty and there are default values,
            //then add un-updated-default-values to data

            const __defaultInputData = defaultInputData
            for (const key in __defaultInputData) {

                if(!(key.trim().toLowerCase() in data)) {
                    data[key] = __defaultInputData[key]
                }

            }
        }else if(data === {} && defaultInputData === {}){
            showSnackBar("All fields are required", "error")
            return
        }

        if(plateNumber === '') {
            showSnackBar("Plate Number is required", "error")
            return
        }


        let formData = {}

        if(!isUpdate) {

            if( uploadedPdf !== null) {

                if(("name" in uploadedPdf)) {
                    formData = new FormData()
                    formData.append("vehicle_id", plateNumber.id)
                    formData.append('data', JSON.stringify(removeNulls(formatDataHeaders(data))) )
                    formData.append('pdf', uploadedPdf,uploadedPdf.name)
                    formData.append('menu_id', menu_id)
                }
            }
        }else {
            formData['vehicle_id'] = plateNumber.id
            formData['data'] =  JSON.stringify(removeNulls(formatDataHeaders(data)))
        }


        if('id' in authReducer.data) {

            if(isUpdate) {

                dispatch(updateMenuData(formData, authReducer.data.id, incomingData.id, menu_id))

            }else {
                dispatch(setNewMenuData(formData, authReducer.data.id, navigate))
            }
        }


    }



    if(menuDataReducer.message) {
        showSnackBar(menuDataReducer.message.message, 'success');
        dispatch({ type: CLEAR_MENU_DATA_MESSAGE})
    }

    if(menuDataReducer.error) {

        if("errors" in menuDataReducer.error) {

            for (const key in menuDataReducer.error.errors) {

                showSnackBar(menuDataReducer.error.errors[key]["0"], 'error');

            }
        }else if("error" in menuDataReducer.error) {

            showSnackBar(menuDataReducer.error.error, 'error');
        }else if("message" in menuDataReducer.error) {

            showSnackBar(menuDataReducer.error.message, 'error');
        }


        dispatch({ type: CLEAR_MENU_DATA_ERROR})
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

        setTimeout(closeSnackbar, 5000)
    }
    const links = [
        {
            url:"/ana-sayfa",
            name: "Anasayfa"
        },
        {
            url:"/otomatik/veri/"+menu_id,
            name: reverseUrlName(title)
        },
        {
            url:"/otomatik/form/"+title,
            name: "yeni ekle "+ reverseUrlName(title)
        }

    ]

    function reverseUrlName(name) {

        //used to add back slashes ( '/' ) incase menu name has a underscores character eg(debit___receipt)
        const nameParts = name.split("___")
        if(nameParts.length > 0) {
            return nameParts.join('/')
        }
        return name

    }


    function formatDataHeaders(data) {
        const newData = {}
        for (const key in data) {
            const keyParts = key.split("___")
            if(keyParts.length > 0) {
                newData[keyParts.join('.')] = data[key]
            }else {
                newData[key] = data[key]
            }
        }


        return newData
    }



    const getTextInputValue = (name)=> {
        return (defaultInputData !== null && defaultInputData !== {})?defaultInputData[name.trim().toString()]:''
    }


    return (

        <>

            {
                isUpdate?
                <></>
                :
                <BreadCrumb links={links} />
            }
            <Paper className={isUpdate?classes.root1:classes.root} >

                <Typography className={classes.header}> OGZ CEZA SISTEMI </Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">yeni {reverseUrlName(title)}</Typography>


                <form onSubmit={onSubmit}>
                    <Grid
                        container
                        spacing={2}
                        style={{marginTop: '10px'}}
                    >
                        {
                            menuReducer.loading?<ProgressSpinner />
                            :
                            menuReducer.menuEntries.map((item, index)=>{

                                if(item.name !== "pdf") {
                                    return (

                                        <Grid
                                            item
                                            xs={12}
                                            key={item.id}
                                        >
                                            <TextField
                                                key={uKey + '-t' + index}
                                                label={item.name}
                                                placeholder={item.name}
                                                name={item.name}
                                                className= {classes.textfield}
                                                fullWidth
                                                defaultValue={getTextInputValue(item.name)}
                                                onChange={(e)=>handleInputChange(item.name, e.target.value)}
                                                // {...register(formatInputName(item.name),{ required: true })}
                                            />
                                            {/* {errors[item.name] && <span>This field is required</span>} */}
                                        </Grid>
                                    )
                                }

                                return <></>

                            })
                        }


                        {

                            isUpdate? <></>
                            :


                                <Grid
                                    item
                                    xs={12}
                                >

                                    <Typography variant="h6" className={classes.label} style={{marginBottom: '10px'}}>PDF belgesi</Typography>
                                    <DropzoneArea
                                        key={uKey + '-d1'}
                                        acceptedFiles={['application/pdf']}
                                        showPreviews={true}
                                        useChipsForPreview
                                        showPreviewsInDropzone={false}
                                        maxFileSize={5000000}
                                        filesLimit={1}
                                        dropzoneText="PDF belgesini buraya sürükleyip bırakın"
                                        onChange={handleFileChange}
                                    />
                                    <span>{fileError}</span>

                                </Grid>
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
                                {menuDataReducer.loading ?<ProgressSpinner /> :"Kaydet"}
                            </Button>

                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </>
    );



}
