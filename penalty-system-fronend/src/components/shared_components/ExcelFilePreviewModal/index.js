import React, { useState, useEffect } from 'react';
import { Button, DialogActions,
    Dialog,DialogContent, DialogTitle, IconButton, MenuItem, Typography, Card, CardContent, CardActions, Avatar, Grid, Link
} from '@material-ui/core';
import { Close, CloudDownload, Folder } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { downloadFile, getAllFiles, setExcelFiles } from '../../../store/reducers/excel_files/excelFiles.actions';
import ProgressLoader from '../ProgressBarSpinner'
import { useSnackbar } from 'notistack';
import { CLEAR_EXCEL_FILE_ERROR, CLEAR_EXCEL_FILE_MESSAGE } from '../../../store/reducers/excel_files/excelFiles.types';
import Alert from '@material-ui/lab/Alert';
import excel from '../../../images/excel.png'
import axios from 'axios';
import fileDownload from 'js-file-download';
import readXlsxFile from 'read-excel-file'
import { useRef } from 'react';


export default function ExcelFileModal(props){

    const { excelFileType } = props
    const fileValue = useRef(null)
    const [open, setOpen] = useState(false)
    const [excelFile, setExcelFile] = useState(null)
    const dispatch = useDispatch()
    const excelFileReducer = useSelector((state) => state.excelFileReducer)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = ()=>{
        setOpen(false)
    };


    useEffect(() => {

        dispatch(getAllFiles(excelFileType))

    }, [open])

    const handlePreviewExcel = (file)=>{
        readXlsxFile(file).then((rows) => {
            console.log(rows)
            // `rows` is an array of rows
            // each row being an array of cells.
        })
    }

    const handleExcelFileChange = (e)=>{
        handlePreviewExcel(e.target.value)
        console.log("vvghjvg")
    }

    const handleDownloadFile = (file_id)=> {
        //file_id
        downloadFile(file_id).then((blob)=>{
            console.log(blob)
            handlePreviewExcel(blob)
            
            //const url = window.URL.createObjectURL(blob);
            // setExcelFile(blob)
            // fileValue.current.dispatchEvent(
            //     new Event("change", {bubbles: true,})
            // );
        }).catch(console.log)
    }

    if(excelFileReducer.message) {
        showSnackBar(excelFileReducer.message, 'success');
        dispatch({ type: CLEAR_EXCEL_FILE_MESSAGE})
    }

    if(excelFileReducer.error) {
        // if("errors" in excelFileReducer.error) {
        //     for (const key in excelFileReducer.error.errors) {

        //         showSnackBar(excelFileReducer.error.errors[key]["0"], 'error');
                
        //     }
        // }else if("error" in excelFileReducer.error) {

        //     showSnackBar(excelFileReducer.error.error, 'error');
        // }
        //  dispatch({ type: CLEAR_EXCEL_FILE_ERROR})
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


    return (<div>

        <MenuItem 
            onClick={handleClickOpen}
        >
            
            <IconButton variant="contained" 
                >
                <Folder />
            </IconButton>
            <p>Tüm Excel Dosyaları</p>

        </MenuItem>
        <Dialog maxWidth="md" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">

            Excel Belgeleri
                
            </DialogTitle>
            <DialogContent>

                {
                    excelFileReducer.loading?
                        <ProgressLoader />
                    :

                        ("data" in excelFileReducer.data)?

                            <Grid container spacing={1}>
                                {
                                    excelFileReducer.data.data.map((item)=>(

                                        <Grid item xs={6} md={5}>
                                            <Grid container   
                                                direction="column"
                                                alignItems="center"
                                                justify="center">

                                                <Grid item xs={12} md={12} style={{marginBottom: '10px'}}>

                                                    <Card style={{width: '98%', height: '150px'}}>
                                                        <CardContent>


                                                            

                                                            <Grid container>
                                                            <Grid item xs={5}>

                                                                <Avatar alt="excel file" variant="square" src={excel} style={{width: '50px', height: '50px'}}/>
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                <Typography variant="h6" style={{fontSize: '13px', fontWeight: 'bold'}}>{item.created_at}</Typography>
                                                            </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                        <CardActions>


                                                            <Link href={item.file_url} target="_blank">
                                                                İndir
                                                            </Link>
                                                            <Button 
                                                                value={item.file_url}
                                                                onClick={()=>handleDownloadFile(item.id)}
                                                            >
                                                                Preview file
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>


                                            </Grid>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        :
                        <Alert severity="info">0 sonuç bulundu</Alert>


                }

            </DialogContent>
            
            <DialogActions>
                    <Button startIcon={<Close />} color="primary" variant="contained" onClick={handleClose}>
                        Kapat
                    </Button>
            </DialogActions> 

            <input type="file" ref={fileValue} value={excelFile} className="d-none" onChange={handleExcelFileChange}/>
        </Dialog>
    </div>)


  }
