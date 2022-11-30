import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Tooltip, Typography, } from '@material-ui/core';
import {useEffect, useState} from 'react';
import ExcelFile from 'react-data-export/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-data-export/dist/ExcelPlugin/elements/ExcelSheet';
import {alignmentStyle, borderStyle, exportCommonStyle} from '../../../utils/constants';

const LicensePenaltyDialog = (props) => {
    const {
        dialogOpen,
        handleClose,
        dataSet,
        dataSetHeaders,
        listData,
        selectedData,
        headers
    } = props;
    const [selectedHeaders, setSelectedHeaders] = useState('');
    const [exportData, setExportData] = useState([]);

    useEffect(() => {
        setExportData(selectedData.length ? selectedData : listData);
    }, [selectedData])

    const toggleHeaderSelection = (event) => {
        let list = selectedHeaders && selectedHeaders.length ? selectedHeaders.split(',') : [];
        let index = list.indexOf(event.target.value);
        if (index > -1) {
            list.splice(index, 1)
        } else {
            list.push(event.target.value)
        }
        setSelectedHeaders(list.join(','));
    }

    const prepareData = () => {
        let columns = [];
        let data = [];
        if (selectedHeaders.length) {
            let cols = [];
            headers.forEach((item) => {
                if (selectedHeaders.split(',').includes(item.field)) {
                    cols.push(item.field)
                    delete item.field;
                    columns.push(item);
                }
            })

            exportData.forEach((item, index) => {
                let nano = [];
                if (cols.includes('plate_number')) {
                    nano.push(
                        {
                            value: item.plate_number,
                            style: {
                                font: {sz: "12", bold: false},
                                border: borderStyle,
                                alignment: alignmentStyle
                            }
                        }
                    )
                }
                if (cols.includes('total_count')) {
                    nano.push(
                        {
                            value: item.total_count,
                            style: {
                                font: {sz: "12", bold: false},
                                border: borderStyle,
                                alignment: alignmentStyle
                            }
                        }
                    )
                }
                if (cols.includes('amount')) {
                    nano.push(
                        {
                            value: item.amount,
                            style: {
                                font: {sz: "12", bold: false},
                                border: borderStyle,
                                alignment: alignmentStyle
                            }
                        }
                    )
                }
                data.push(
                    nano
                )
            })

            /*exportData.forEach((item, index) => {
                let innerCol = [];
                cols.forEach(col => {
                    innerCol.push({
                        value: item[col],
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    })
                });
                if (innerCol.length) data.push(innerCol);
            })*/
        }

        let dataExport = [{
            columns: columns,
            data: data
        }];

        console.log('dataExport', dataExport)

        return dataExport
    }

    const DownloadExcel = ({ data, fileName }) => {

        return (
            <>
                <ExcelFile
                    filename={fileName}
                    element={
                        <Tooltip title="Excel Aktar" aria-label="Export Excel Data" placement="top">
                            <Button variant="contained" color="primary">EXCEL AKTAR</Button>
                        </Tooltip>     
                    }>
                    <ExcelSheet dataSet={data} name="Report" />
                </ExcelFile>
            </>
        );
    }

    const ExportPenalty = () => {
        const data = prepareData();
        console.log('ExportPenalty data', data);
        return (
            <DownloadExcel data={data} fileName={"plaka_cezalar_report"} />
        );
    }
    
    return (
        <Dialog
            open={dialogOpen}
            onClose={handleClose}
            dataSet={dataSet}
            dataSetHeaders={dataSetHeaders}>
            <DialogTitle id="alert-dialog-slide-title">Excel'e aktarmak istedigin veiriyi sec</DialogTitle>
            <DialogContent>
                <FormGroup>
                    {
                        (headers.length > 0) ?
                        headers.map((item,index)=>(
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            onChange={toggleHeaderSelection} 
                                            // checked={headers.some(head => selectedHeaders.includes(head))}
                                            name={"checked"+index} value={item.field} />
                                    }
                                    label={item.title} />
                            ))
                        :
                        <Typography variant="small">0 sonuç bulundu</Typography>
                    }
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" variant="contained">
                    Kapat
                </Button>
                
                <ExportPenalty />
                {/* <DownloadExcel data={prepareData} selectedHeaders={selectedHeaders} /> */}
            </DialogActions>
        </Dialog>
    );
}

export default LicensePenaltyDialog