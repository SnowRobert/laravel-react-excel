import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {styles, DialogContent, DialogActions} from './style'
import {Document, Page, pdfjs} from "react-pdf";
import pdfjsWorker from "react-pdf/dist/esm/pdf.worker.entry";
import {useSnackbar} from 'notistack';
import {Close} from '@material-ui/icons';
// import PDFFile from '../../../images/demo.pdf'
// import useMediaQuery from '@material-ui/core/useMediaQuery'

// import PDFViewer from 'pdf-viewer-reactjs'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";


const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export default function CustomizedDialogs(props) {

    const {pdf, handleClose, open} = props;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePdfError = (err) => {
        console.log(err)
    }
    const onDocumentLoadSuccess = ({numPages}) => {
        setNumPages(numPages);
    }

    const handleNextPage = () => {
        if (pageNumber <= numPages) {
            setPageNumber((pageNumber + 1))
        } else {
            showSnackBar("bu son sayfa", "error")
        }
    }

    const handlePreviousPage = () => {
        if (pageNumber > 0) {
            setPageNumber((pageNumber - 1))
        } else {
            showSnackBar("geçersiz sayfa", "error")
        }
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


    return (
        <div>
            <Dialog
                // fullScreen={fullScreen}
                onClose={handleClose}
                maxWidth="lg"
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Pdf dosyasi yuklenemedi
                </DialogTitle>
                <DialogContent dividers>
                    <Document
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} scale={2}/>
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Kapat
                    </Button>
                    <Button autoFocus onClick={handlePreviousPage} color="secondary">

                        önceki sayfa
                    </Button>
                    <Button autoFocus onClick={handleNextPage} color="secondary">
                        sonraki Sayfa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
