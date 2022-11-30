import React, { useState, useEffect } from 'react';
import { Button, DialogActions,
    Dialog,DialogContent, DialogTitle, IconButton, MenuItem, Typography, Card, CardContent, CardActions, Avatar, Grid, Link
} from '@material-ui/core';
import Table from '../table';
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


export default function ExcelFilePreview(props){

    const { excelFileType, counter } = props
    const fileValue = useRef(null)
    const [excelFile, setExcelFile] = useState(null)
    const [excelRows, setExcelRows] = useState([])
    const [excelHeaders, setExcelHeaders] = useState([])
    const dispatch = useDispatch()
    const excelFileReducer = useSelector((state) => state.excelFileReducer)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
   
    useEffect(() => {

        dispatch(getAllFiles(excelFileType, 'created_at', 1, 1))

    }, [counter])

    const handlePreviewExcel = (file)=>{
        readXlsxFile(file).then((rows) => {
            //since first row is empty, remove it
            rows.splice(0, 1)
            if(excelHeaders.length < 1) {
                setExcelHeaders(rows[0])
            }
            //remove the header data from rows
            rows.splice(0, 1)
            setExcelRows([...rows, ...excelRows])
        })
    }

    const handleExcelFileChange = (e)=>{
        handlePreviewExcel(e.target.value)
    }

    const handleDownloadFile = (file_id)=> {
        //file_id
        downloadFile(file_id).then((blob)=>{
            handlePreviewExcel(blob)
            
        }).catch(console.log)
    }

    if(excelFileReducer.message) {
        showSnackBar(excelFileReducer.message, 'success');
        dispatch({ type: CLEAR_EXCEL_FILE_MESSAGE})
    }

    if(excelFileReducer.error) {
        if("errors" in excelFileReducer.error) {
            for (const key in excelFileReducer.error.errors) {

                showSnackBar(excelFileReducer.error.errors[key]["0"], 'error');
                
            }
        }else if("error" in excelFileReducer.error) {

            showSnackBar(excelFileReducer.error.error, 'error');
        }
         dispatch({ type: CLEAR_EXCEL_FILE_ERROR})
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

    useEffect(() => {
    
        if("data" in excelFileReducer.data && excelFileReducer.loading === false) {
            excelFileReducer.data.data.forEach(item => {
                handleDownloadFile(item.id)
            })
        }
        
    }, [excelFileReducer.loading])
    


    return (
        <div>
            <div aria-labelledby="form-dialog-title">
                <div>

                    
                    <Table rows= {excelRows} 
                        tableHeader ={ excelRows }/>

                    {/* {
                        excelFileReducer.loading?
                            <ProgressLoader />
                        :

                            ("data" in excelFileReducer.data)?

                                <Grid container spacing={1}>
                                    {
                                        excelFileReducer.data.data.map((item)=>(

                                            <Grid item xs={6} md={3}>
                                                <Grid container   
                                                    direction="column"
                                                    alignItems="center"
                                                    justify="center">

                                                    <Grid item xs={12} md={12} style={{marginBottom: '10px'}}>

                                                        <Card style={{width: '98%', height: 'auto'}}>
                                                            <CardContent>


                                                                

                                                                <Grid container>
                                                                    <Grid item xs={12}>

                                                                        <Avatar alt="excel file" variant="square" src={excel} style={{marginLeft: "40%" ,width: '50px', height: '50px'}}/>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" style={{fontSize: '13px', fontWeight: 'normal', textAlign: 'center', marginTop: '15px'}}>{item.created_at}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </CardContent>
                                                            <CardActions>

                                                                <div style={{display: "flex", flex: 1}}></div>
                                                                <Link href={item.file_url} target="_blank" style={{textDecoration: 'none'}}>
                                                                    <Button variant="contained" size="small" >
                                                                        İndir
                                                                    </Button>
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


                    } */}

                </div>

                <input type="file" ref={fileValue} value={excelFile} className="d-none" onChange={handleExcelFileChange}/>
            </div>
        </div>
    )


  }
