import {  Button, Chip, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import { Add, Close, CloudUpload } from '@material-ui/icons';
import React, { useState } from 'react'
import {useStyles} from '../new_vehicle/style';
import BreadCrumb from '../../BreadCrump';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import ProgressSpinner from '../../ProgressBarSpinner'
import { CLEAR_MENU_ERROR, CLEAR_MENU_MESSAGE } from '../../../../store/reducers/menu/menu.types';
import { setNewMenuEntries } from '../../../../store/reducers/menu/menu.actions';

export default function NewMenuFields(props) {

    const { menu, menu_id } = props
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [fields, setFields] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState('')
    const navigate =  useNavigate()
    const dispatch = useDispatch()
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


    const handleSaveBtnClick = () => {

        const data = {
            menu_id: menu_id,
            name: fields
        }
        if('id' in authReducer.data) {

            dispatch(setNewMenuEntries(data, authReducer.data.id, navigate))
        }
        
    }

    const showSnackBar = (msg, variant = 'info') => {
        enqueueSnackbar(msg, {
            variant: variant,            
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Close />
                </IconButton>
            ),
        })
        
        setTimeout(closeSnackbar, 5000)
    }

    const handleTextFieldChange = (event) => {
        if(event.target.value !== '') {
            setTextFieldValue(event.target.value)
        }
    }

    const handleKeyDown = (e)=> {
        if (e.key === 'Enter') {
            handleAddField()
        }
    }

    const handleRemoveField = (value) => {
        
        const _fields = fields.split(',')
        if(_fields.includes(value)){
            const i = _fields.indexOf(value);
            if (i > -1) {
                _fields.splice(i, 1);
            }
        }
        setFields(_fields.join());
      };
      const handleAddField = () => {
            
        const _fields = (fields != null)?fields.split(','):[]

        if(!_fields.includes(textFieldValue.trim().toLowerCase())) {
            _fields.push(textFieldValue.trim().toLowerCase());
            setTextFieldValue('')
            setFields(_fields.join());
        }else {

            showSnackBar("Bu alan zaten eklendi", "error")
            setTextFieldValue('')
            
        }
       

      };

      if(menuReducer.message) {
        showSnackBar(menuReducer.message, 'success');
        dispatch({ type: CLEAR_MENU_MESSAGE})
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

    const fieldsToBeDisplayed = (fields != null)?fields.split(','):[];
    return (

        <>
            
            <BreadCrumb links={links} />
            <Paper className={classes.root} >

                <Typography className={classes.header}>Menü sorguları ekle</Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">{"Menü:  "+menu}</Typography>
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
                            label={"yeni menü öğesi"} 
                            placeholder={"yeni menü öğesi"}
                            name="new_menu_item"
                            className= {classes.textfield}
                            fullWidth
                            onChange={handleTextFieldChange}
                            value={textFieldValue}
                            onKeyPress={handleKeyDown}
                        />
                        
                    </Grid>  

                    <Grid item xs={12}>

                        {
                            (fieldsToBeDisplayed.length > 0)?
                                fieldsToBeDisplayed.map((item, index)=>(


                                    <Chip
                                        label={item}
                                        onDelete={()=>{handleRemoveField(item)}}
                                        color="primary"
                                        key={index}
                                        style={{margin: '3px'}}
                                    />


                                ))
                            :
                            <></>
                        }
                           
                        
                    </Grid>

                </Grid>

                <Grid
                        container            
                        direction="column"
                        alignItems="center"
                        justify="center"
                >
                    <Grid item xs={12} md={12}>
                        
                        <Button startIcon={<Add />} variant="contained" color="secondary" 
                            onClick={()=>{handleAddField()}} className={classes.submitBtn} 
                        >
                            Sorgulara Ekle
                        </Button>

                        <Button startIcon={<CloudUpload />} 
                            onClick={handleSaveBtnClick}
                            variant="contained" color="primary" className={classes.submitBtn} >

                                {
                                    menuReducer.loading?<ProgressSpinner />:"Kaydet"
                                }
                            
                        </Button>

                    </Grid>
                </Grid>
            </Paper>
        </>
    );
    
}
