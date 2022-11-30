
import React, {useEffect, useRef, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import BreadCrumb from '../../BreadCrump';
import ProgressSpinner from '../../ProgressBarSpinner'
import Button from '@material-ui/core/Button';
import { Chip,  IconButton, TextField, Typography,  Paper, Grid, } from '@material-ui/core';
import { Close, Print } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint2 from '../../PrintDataModal/componentToPrint3'
import { printData } from '../../../../utils/constants'
import {useStyles} from '../new_vehicle/style'
import ViewData from './view_data'

export default function PrintForm (props) { 
    const classes = useStyles();
  const [printableData, setPrintableData] = useState([])
  const [formInputData, setFormInputData] = useState({})
  const [viewDataMode, setViewDataMode] = useState(false)
  const [rows, setRows] = useState(0)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const componentRef = useRef()
  
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })


  const handleInputChange = (inputName, inputValue)=> {
    const data = formInputData
    data[inputName] = inputValue
    setFormInputData(data)
}
const handleAddToList = (e)=> {

  e.preventDefault()
    let isFormInputEmpty = true
    for(const key in formInputData) {
        if( key !== "") {
            isFormInputEmpty = false
            break
        }
    }
    
  console.log(isFormInputEmpty)
    if(isFormInputEmpty === false)  {
            
        const data = printableData.slice()
        data.push(formInputData)
        setPrintableData(data)
        showSnackBar("listeye eklenen veriler, daha fazla veri ekleyin veya yazdır'ı tıklayın", "success")  
    }
}

const removeData = (position)=> {


    const newData = []
    printableData.forEach((element, index) => {
        if(index !== parseInt(position)) {
            newData.push(element)
        }
    });
    setPrintableData(newData)
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
        
        setTimeout(closeSnackbar, 5000)
    }
    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/yazdir",
            name: "Yazdir"
        },
        
    ]


    return (

        <>
            
            {
                <BreadCrumb links={links} />
            }
            <Paper className={classes.root} >

                <Typography className={classes.header}> OGZ CEZA SISTEMI </Typography>
                <Typography variant="h6" className={classes.header2}  color="primary">{"Verileri Yazdır"}</Typography>



                <Grid container>
                    <Grid item xs={3}>

                            <Chip clickable label="Veri ekle" 
                                color={viewDataMode === false?"secondary":""}
                                 onClick={()=>{
                                     setViewDataMode(false)
                                 }}
                             />
                    </Grid>
                    <Grid item xs={3}>

                            <Chip clickable label="Veriyi gör" 
                                color={viewDataMode === true?"secondary":""} 
                                onClick={()=>{
                                    setViewDataMode(true)
                                }}
                            />
                    </Grid>
                </Grid>


                
                {

                    viewDataMode?

                    <ViewData headers={getHeaders()} data={ getData()} handleRemoveData={removeData} />

                    :

                    
                    <form onSubmit={handleAddToList}>

                        <Grid
                                container        
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
                                            className= {classes.textfield}
                                            fullWidth
                                            type={item.type}
                                            onChange={(e)=>handleInputChange(item.name, e.target.value)}
                                            defaultValue={getTextInputValue(item.name)}

                                        />
                                    </Grid>
                                ))
                            }



                            <Grid item xs={12} style={{marginTop: '20px'}}>
                                <Button variant="outlined" onClick={()=>setPrintableData([])} style={{margin: '5px'}}>
                                    
                                    
                                    Sıfırla
                                </Button>
                                <Button color="secondary" type="submit" variant="outlined"  style={{margin: '5px'}} onClick={handleAddToList}>
                                    
                                    Ekle
                                </Button>
                                

                                
                                <Button color="primary" variant="outlined" style={{margin: '5px'}} onClick={handlePrint}>
                                    Yazdır
                                </Button>


                                
                                <div style={{display: 'none'}}>
                                    <ComponentToPrint2 headers={getHeaders()} data={getData()} ref={componentRef} title={"Teslim Tutanagi"}/>
                                </div>

                            </Grid>
                        </Grid>
                    </form>
                    
                }
            </Paper>
        </>
    );


    
}
