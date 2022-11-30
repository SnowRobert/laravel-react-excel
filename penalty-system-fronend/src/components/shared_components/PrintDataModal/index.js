import React, {useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Chip, Grid, IconButton, ListItem, TextField, Typography } from '@material-ui/core';
import { Close, Print } from '@material-ui/icons';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { StyledMenuItem } from '../AppBar1/drop_down_menu/style'
import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint2 from './componentToPrint2'
import { printData } from '../../../utils/constants'

export default function PdfModal(props) {
  const { isNavBar } = props
  const [open, setOpen] = useState(false);
  const [printableData, setPrintableData] = useState([])
  const [formInputData, setFormInputData] = useState({})
  const [rows, setRows] = useState(0)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const componentRef = useRef()
  
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (inputName, inputValue)=> {
    const data = formInputData
    data[inputName] = inputValue
    setFormInputData(data)
}
const handleAddToList = (e)=> {

  e.preventDefault()
  console.log("sdfdsgsdgsdf")
    let isFormInputEmpty = true
    for(const key in formInputData) {
        if( key !== "") {
            isFormInputEmpty = false
            break
        }
    }
    if(isFormInputEmpty === false)  {
            
        const data = printableData.slice()
        data.push(formInputData)
        setPrintableData(data)
        showSnackBar("listeye eklenen veriler, daha fazla veri ekleyin veya yazdır'ı tıklayın", "success")  
    }
}



useEffect(() => {
    setFormInputData({})
}, [printableData])


useEffect(()=>{
  setRows(printableData.length)
}, [printableData])

const getTextInputValue = (name)=> {
    return (name in formInputData)?formInputData[name]:''
}



  const printFields = printData


  const getHeaders = ()=> {

    const headers = printFields.map((item)=>item.name)
    headers.unshift('#')
    return headers
  }


  const getData = ()=> {

    const headers = getHeaders()

    const data = []

    printableData.forEach((element, index) => {

        const newData = {}
        for(const value of headers) {

            if(!(value in element)) {
              if(value === '#'){
                newData[value] = index+1
              }else {
                newData[value] = ""
              }
            }else {
              newData[value] = element[value]

            }

        }
        data.push(newData)
        
    });

    return data


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


      {

        isNavBar?


          <StyledMenuItem onClick={handleClickOpen} >
            <ListItemIcon>
                <Print />
            </ListItemIcon>
            <ListItemText primary={"Verileri Yazdır"} />
          </StyledMenuItem>
        :

        <ListItem button onClick={handleClickOpen}>
            <ListItemIcon>
                <Print />
            </ListItemIcon>
            <ListItemText primary={"Verileri Yazdır"} />
        </ListItem>

      }
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Verileri Yazdır"}</DialogTitle>
            <form style={{padding: '10px 20px 20px 20px'}} onSubmit={handleAddToList}>
        <DialogContent>


                <Grid 
                    container 
                    spacing={2}
                >

                        {
                            printFields.map((item, index)=>(

                                <Grid 
                                    item 
                                    xs={12}
                                    key={index}                                
                                >

                                    <TextField
                                        label={item.placeholder} 
                                        placeholder={item.placeholder}
                                        name={item.name}
                                        fullWidth
                                        type={item.type}
                                        onChange={(e)=>handleInputChange(item.name, e.target.value)}
                                        defaultValue={getTextInputValue(item.name)}

                                    />
                                </Grid>
                            ))
                        }
                        

                </Grid>



        </DialogContent>
            <Typography style={{textAlign: 'center'}}>
                {rows} toplam satır eklendi
            </Typography>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            kapat
          </Button>
          <Button variant="outlined" onClick={()=>setPrintableData([])}>
            
            
            Sıfırla
          </Button>
          <Button color="secondary" type="submit" variant="outlined" onClick={handleAddToList}>
            
            Ekle
          </Button>
          

          
          <Button color="primary" variant="outlined" onClick={handlePrint}>
            Yazdır
          </Button>
        </DialogActions>
            </form>
        <div style={{display: 'none'}}>
              <ComponentToPrint2 headers={getHeaders()} data={getData()} ref={componentRef} title={"Teslim Tutanagi"}/>
        </div>
      </Dialog>
    </div>

    
  );
}
