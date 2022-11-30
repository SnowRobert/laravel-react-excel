import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Info } from '@material-ui/icons';
import { getPlaceHolderName, getTurkishDate } from '../../../utils/functions';
import { useReactToPrint } from 'react-to-print';
import { IconButton } from '@material-ui/core';

export default function MoreDetailsModal(props) {


  const [open, setOpen] = React.useState(false);
  const { data, textfields } = props
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

  const rows = () => {
    
    const tRows = []
    const newData = []
    for (const key in data) {
        if(key.trim() !== 'id' && key.trim() !== 'pdf_url' && key.trim() !== 'image_url') {
            if((typeof data[key]) === 'string' || (typeof data[key]) === 'number'){

                if(key.trim() === 'created_at' || key.trim() === 'updated_at'){
                        
                    newData.push(getTurkishDate(data[key]))
                }else{
                    
                    newData.push(data[key])
                }
                tRows.push(getPlaceHolderName(key, textfields))
            }
        }
    }

    return ({
        tRows: tRows,
        data: newData
    })
  }

  const __rows = rows()
  const tRows = __rows.tRows
  const newData = __rows.data

  return (
    <div>
      
      <IconButton style={{color: '#00b33c'}} onClick={handleClickOpen}> <Info /> </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"md"}>
        <DialogTitle id="max-width-dialog-title">Plaka No: {data.plate_number} Makbuz: {data.receipt_number}</DialogTitle>
        <DialogContent>

            <table className={["table, table-striped"].join()} style={{width: '100%'}}  ref={componentRef}>
                <thead>
                    <th scope="col">#</th>
                    <th scope="col">{"ayrıntılar".toUpperCase()} </th>
                </thead>
                <tbody>
                    
                    {
                        tRows.map((item, index)=>(                                    
                            <tr key={index}> 
                            
                                <td scope="row" style={{padding: '15px 20px', fontWeight: 'bold', fontSize: '17px', color:'#000'}}> {item} </td>
                                <td >{ newData[index] }</td>
                            </tr>
                        
                        ))
                    }

                </tbody>
            </table>

        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="secondary">
            Yazdir
          </Button>
          <Button onClick={handleClose} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
