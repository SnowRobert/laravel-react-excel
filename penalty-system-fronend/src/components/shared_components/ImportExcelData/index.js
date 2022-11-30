import React, { useState } from 'react';
import {Button, DialogActions,
    Dialog,DialogContent, DialogTitle, IconButton, MenuItem
} from '@material-ui/core';
import { Close, PhotoCamera, Publish } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setExcelFiles } from '../../../store/reducers/excel_files/excelFiles.actions';
import ProgressLoader from '../ProgressBarSpinner'
import { useSnackbar } from 'notistack';
import { CLEAR_EXCEL_FILE_ERROR, CLEAR_EXCEL_FILE_MESSAGE } from '../../../store/reducers/excel_files/excelFiles.types';


export default function ImportExcelData(props) {

    const { excelFileType } = props
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState([])
    const dispatch = useDispatch()
    const authReducer = useSelector((state) => state.authReducer)
    const excelFileReducer = useSelector((state) => state.excelFileReducer)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    const handleFileChange = (files)=>{
            
        setFiles(files)

    }

    const handleUploadFiles = ()=> {

        if(files.length > 0 ){

            const formData = new FormData()
            for(const file of files){
                formData.append("files[]", file)
            }
            formData.append('page_type', excelFileType)
    
            if("id" in authReducer.data){
                dispatch(setExcelFiles(formData,authReducer.data.id))
            }
        }else {
            showSnackBar("No files added", "error")
        }
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


    return (<div>

        <MenuItem 
            onClick={handleClickOpen}
        >
            
            <IconButton variant="contained" 
                >
                <Publish />
            </IconButton>
            <p>excel dosyası yükle</p>

        </MenuItem>
        <Dialog maxWidth="md" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"> Excel Verilerini İçe Aktar
            
        </DialogTitle>
        <DialogContent>

            <DropzoneArea
                acceptedFiles={['application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                showPreviews={true}
                useChipsForPreview
                showPreviewsInDropzone={false}
                maxFileSize={10000000}
                filesLimit={10}
                dropzoneText="excel sayfasını buraya sürükleyip bırakın"
                onChange={handleFileChange}
            />


        </DialogContent>
        <DialogActions>
                <Button startIcon={<Close />} onClick={handleClose} color="primary" aria-label="close" component="span">
                kapat
                </Button>
                <Button startIcon={<PhotoCamera />} onClick={handleUploadFiles} color="secondary" aria-label="upload picture" component="span">
                    {excelFileReducer.loading? <ProgressLoader /> :"Excel Belgesi Yükle"}
                </Button>

        </DialogActions>
        </Dialog>
    </div>)


  }
