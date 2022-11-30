import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// import ReactExport from "react-export-excel";
import ReactExport from 'react-data-export';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint2 from '../PrintDataModal/componentToPrint2'
import { pageType, penaltyTextFields } from '../../../utils/constants'
import { color } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {

    const { open, handleClose,dataSet, dataType} = props;
    const componentRef = useRef()
    const componentRef2 = useRef()
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const dataSetHeadersIds = [];


    for (const __data in dataSet["0"]) {
        //get data keys
        dataSetHeadersIds.push(__data);
    }

    // removing unwanted cols
    if(dataSetHeadersIds.includes('#')) {
        const index = dataSetHeadersIds.indexOf('#');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('pdf')) {
        const index = dataSetHeadersIds.indexOf('pdf');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('profile_img')) {
        const index = dataSetHeadersIds.indexOf('profile_img');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('action')) {
        const index = dataSetHeadersIds.indexOf('action');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('AKSİYON')) {
        const index = dataSetHeadersIds.indexOf('AKSİYON');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('select')) {
        const index = dataSetHeadersIds.indexOf('select');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('resim'.toUpperCase())) {
        const index = dataSetHeadersIds.indexOf('resim'.toUpperCase());
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('pdf'.toUpperCase())) {
        const index = dataSetHeadersIds.indexOf('pdf'.toUpperCase());
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }
    if(dataSetHeadersIds.includes('seç')) {
        const index = dataSetHeadersIds.indexOf('seç');
        if (index > -1) {
            dataSetHeadersIds.splice(index, 1);
        }
    }

    const [selectedData, setSelectedData] = useState(dataSetHeadersIds.join())
    const handleSelectAll = ()=> {
        setSelectedData(dataSetHeadersIds.join())
    }
    const handleChange = (event) => {
        const selectedDataSetHeadersIds = selectedData.split(',');
        if(selectedDataSetHeadersIds.includes(event.target.value)){
            const i = selectedDataSetHeadersIds.indexOf(event.target.value);
            if (i > -1) {
                selectedDataSetHeadersIds.splice(i, 1);
            }
        }else {
            selectedDataSetHeadersIds.push(event.target.value);
        }
        setSelectedData(selectedDataSetHeadersIds.join())
    }


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const handlePrint2 = useReactToPrint({
        content: () => componentRef2.current,
    })

    const getArrangedTextFields = ()=> {
        if(dataType === pageType.penalty ) {
            const fieldds = penaltyTextFields.map((item)=>item.placeholder)
            fieldds.push("OLUŞTURULMA TARIHI")
            fieldds.push("TARAFINDAN EKLENDI")
            fieldds.push("GÜNCELLENDI")
            return fieldds
        }
        return null
    }
    const getData = ()=> {
        return dataSet.map((data_item)=>{
            const __dataSet = {}
            let selected = selectedData.split(',')
            if(selected[0] === "") {
                selected.splice(0,1)
            }

            //rearranging order of data columns
            const arrangedHeaders = getArrangedTextFields()
            let newSelected = []
            if(arrangedHeaders !== null) {

                arrangedHeaders.forEach(item => {
                    selected.forEach(element => {
                        if(item.toString().trim() === element.toString().trim()){
                            newSelected.push(item)
                        }
                    })
                })
            }else {
                newSelected = selected
            }


            newSelected.forEach((item) => {
                __dataSet[item] = data_item[item].toString()
            })
            return __dataSet
        })
    }
    
    const getMultiDataSet = ()=>{
      const borders = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
      const alignment = {
        horizontal: "center"
      }

        const dataSet = getData()

        //get columns from keys of data
        const columns = []
        if(dataSet.length > 0) {
          columns.push({
            title: "SL",
            width: {
                wpx: 40
            },
            // style: { fill: {patternType: "solid", fgColor: {rgb: "3461eb"}}}
            style:{
              font: {color: {rgb: "ffffff"}}, 
              fill: {patternType: "solid", fgColor: {rgb: "3461eb"}},
              border:borders, 
              alignment: alignment
            }
          })
            for(const key in dataSet[0]) {
                columns.push({
                  title: key,
                  width: {
                      wpx: key.length * 15
                  },
                  // style: { fill: {patternType: "solid", fgColor: {rgb: "3461eb"}}}
                  style:{
                    font: {color: {rgb: "ffffff"}}, 
                    fill: {patternType: "solid", fgColor: {rgb: "3461eb"}},
                    border:borders, 
                    alignment: alignment
                  }
                })
                // columns.push({value: key, style: {widthPx: key.length * 20}});
            }
        }


        const multiDataSet = [{
            columns: columns,
            data: []
        }]

        dataSet.forEach((item, index) => {
            const row = []
            row.push({value: index+1, style: {
              font: {sz: "12", bold: false},
              border:borders,
              alignment: alignment
          }})
            for (const key in item) {
                row.push({value: item[key], style: {
                    font: {sz: "12", bold: false},
                    border:borders,
                    alignment: alignment
                }})
            }

            multiDataSet['0'].data.push(row)
        });


        return(multiDataSet)
    }

    const ExportToExcelBtn = () => {

        const multiDataSet = getMultiDataSet()

        return (
            <>


                {
                    (multiDataSet !== null && multiDataSet !== undefined && multiDataSet.length > 0)?


                        <ExcelFile
                            filename={"report"}
                            element={
                                <Button variant="contained" color="primary"
                                    disabled={(selectedData.split(',').length === 1 && selectedData.split(',')["0"] === "" )}
                                    onClick={handleClose}
                                > Excel Aktar</Button>
                                }
                            >
                            <ExcelSheet dataSet={multiDataSet} name="Report" />
                        </ExcelFile>

                    :
                    <></>
                }

            </>
        );
    }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Excel'e aktarmak istedigin veiriyi sec</DialogTitle>
        <DialogContent>


            <FormGroup>
                {
                    (dataSetHeadersIds.length > 0)?
                        dataSetHeadersIds.map((item,index)=>(

                            <FormControlLabel
                                control={<Checkbox onChange={handleChange} checked={selectedData.split(',').includes(item)} name={"checked"+index} value={item} />}
                                label={item}
                            />
                        ))
                    :
                    <Typography variant="small">0 sonuç bulundu</Typography>
                }
            </FormGroup>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelectAll} color="secondary" variant="contained">
            hepsini seç
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Kapat
          </Button>
          <Button onClick={handlePrint} color="primary" variant="contained"
            disabled={(selectedData.split(',').length === 1 && selectedData.split(',')["0"] === "" )}>
            YAZDIR TRAFİK CEZA LİSTESİ
          </Button>

          {
              dataType === pageType.penalty?


                <Button onClick={handlePrint2} color="primary" variant="contained"
                    disabled={(selectedData.split(',').length === 1 && selectedData.split(',')["0"] === "" )}>
                    YAZDIR TESLİM TUTANAĞI
                </Button>
              :<></>
          }
          <ExportToExcelBtn />
        </DialogActions>


        <div style={{display: 'none'}}>
              <ComponentToPrint2 headers={selectedData.split(',')} data={getData()} ref={componentRef} title={"TRAFİK CEZA LİSTESİ"} />
              <ComponentToPrint2 headers={selectedData.split(',')} data={getData()} ref={componentRef2} title={"TESLİM TUTANAĞ"} />
        </div>
      </Dialog>
    </div>
  );
}
