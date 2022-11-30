
import React, { useEffect, useState } from 'react'
import { Divider, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Tooltip, Button, Checkbox, FormControlLabel  } from '@material-ui/core';
import SummaryCards from '../../shared_components/summary_card';
import { SummaryCardItems } from '../../data/summaryCardItems';
import {Line,Doughnut, Bar } from 'react-chartjs-2';
import { State } from '../../data/totalPenaltiesPerWeek';
import { PaymentData } from '../../data/paymentData';
import { garage_status_state } from '../../data/vehicle_unit_garage_status';
import { useStyles } from './style';
import MenuCard from '../../shared_components/menu_card';
import Calendar from 'react-calendar';
import DashboardCard from '../../shared_components/dashboard_card';
import 'react-calendar/dist/Calendar.css';
import DataProgressRateCard from '../../shared_components/DataProgressRateCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllStatistics } from '../../../store/reducers/statistics/statistics.actions';
import ProgressSpinner from '../../shared_components/ProgressBarSpinner'
import { translateDates } from '../../../utils/functions'
import axios from 'axios';
import { ClearAll, MoreVert, Publish, Refresh } from '@material-ui/icons';
import ReactExport from 'react-data-export';
import ColumnSelectionModal from '../../shared_components/columnSelectionModal';
import LicensePenaltyDialog from './LicensePenaltyDialog';
import ImageModal from '../../shared_components/ImageModal';
import { getPlaceHolderName, getTurkishDate } from '../../../utils/functions'
import { penaltyTextFields, borderStyle, alignmentStyle, exportCommonStyle } from '../../../utils/constants';
import PenaltyMenu from '../../views/penalty/actionBtns'

const secretariateExportHeaderStyle = {
    font: {sz: "12", bold: false, color: {rgb: "ffffff"}},
    fill: { patternType: "solid", fgColor: {rgb: "00B0F0"} },
    border: borderStyle,
    alignment: alignmentStyle
}

export default function Dashboard(props) {
    
    const [calendarDate, setCalendarDate] = useState(new Date());
    const classes = useStyles();
    const dispatch = useDispatch()
    const statisticsReducer = useSelector((state) => state.statisticsReducer)
    const menuReducer = useSelector(state => state.menuReducer)
    const [licensePenaltyList, setLicensePenaltyList] = useState([]);
    const [directoryPenaltyList, setdirectoryPenaltyList] = useState([]);
    const [departmentPenaltyList, setdepartmentPenaltyList] = useState([]);
    const [secretariatsPenaltyList, setsecretariatsPenaltyList] = useState([]);
    const [searchFilterOne, setSearchFilterOne] = useState('');
    const [searchFilterTwo, setSearchFilterTwo] = useState('');
    const [searchFilterThree, setSearchFilterThree] = useState('');
    const [searchFilterFour, setSearchFilterFour] = useState('');
    const [status, setStatus] = useState('all');
    const [status2, setStatus2] = useState('all');
    const [status3, setStatus3] = useState('all'); 
    const [status4, setStatus4] = useState('all'); 
    
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [filteredLicensePenaltyList, setFilteredLicensePenaltyList] = useState([]);
    const [filteredDirectoratePenaltyList, setfilteredDirectoratePenaltyList] = useState([]);
    const [filteredDepartmentPenaltyList, setfilteredDepartmentPenaltyList] = useState([]);
    const [filteredSecretariatsPenaltyList, setfilteredSecretariatsPenaltyList] = useState([]);

    const [selectedLicensePenalties, setSelectedLicensePenalties] = useState([]);
    const [selectedDirectoratePenalties, setSelectedDirectoratePenalties] = useState([]);
    const [selectedDepartmentPenalties, setSelectedDepartmentPenalties] = useState([]);
    const [selectedSecretariatsPenalties, setSelectedSecretariatsPenalties] = useState([]);

    const [licenseLoading, setLicenseLoading] = useState(false);
    const [directorateLoading, setDirectorateLoading] = useState(false);
    const [departmentLoading, setDepartmentLoading] = useState(false);
    const [secretariateLoading, setSecretariateLoading] = useState(false);
    
    const [selectedData, setSelectedData] = useState('');

    const loadingHandler = (fn, isLoading) => {
        fn(isLoading)
    }
    
    const summaryCardItems = SummaryCardItems.map((item)=>{

        if(item.id === 'vehicle') {
            const total = statisticsReducer.data.todayTotalVehicles
            item.value = total?total:0
            return item
        }else if(item.id === 'penalties') {
            const total = statisticsReducer.data.todayTotalPenalties
            item.value = total?total:0
            return item
        }else if(item.id === 'total_penalties') {
            const total = statisticsReducer.data.totalPenalties
            item.value = total?total:0
            return item
        }else if(item.id === 'total_vehicles') {
            const total = statisticsReducer.data.totalVehicles
            item.value = total?total:0
            return item
        }
        return item

    })

    const getVehicleUnitGarageChartData = ()=> {

        const ___data = []
          const labels = []
        if("vehicle_unit_garage_status" in statisticsReducer.data) {

            const unit_data = statisticsReducer.data.vehicle_unit_garage_status
            for(const key in  unit_data) {
                labels.push(key)
                ___data.push(unit_data[key])
            }

            return ({
                labels: labels,
                datasets: [
                  {
                    label: 'Birim',
                    backgroundColor: [
                        '#00cc99',
                        '#b3ffb3',
                        '#000000',
                        '#ff1a75',
                        '#ff9966',
                        '#0000ff',
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#668cff',
                        '#ff3300',
                        '#ff9999',
                    ],
                    borderColor: [
                        '#00cc99',
                        '#b3ffb3',
                        '#000000',
                        '#ff1a75',
                        '#ff9966',
                        '#0000ff',
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#668cff',
                        '#ff3300',
                        '#ff9999',
                    ],
                    borderWidth: 2,
                    data: ___data
                  }
                ]
              }
            )
        }

        return garage_status_state
    }

    const getvehicleTypeStats = ()=> {

        const ___data = []
          const labels = []
          
        if("vehicle_type" in statisticsReducer.data) {

            const vehicle_type = statisticsReducer.data.vehicle_type
            
            for(const key in  vehicle_type) {
                labels.push(key)
                ___data.push(vehicle_type[key])
            }

            return ({
                labels: labels,
                datasets: [
                  {
                    label: 'Arac Sayisi',
                    backgroundColor: [
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#ff6666',
                        '#0000ff',
                        '#00cc99',
                        '#00e600'
                    ],
                    borderColor: [
                        'rgba(75,192,192,1)',
                        '#66b3ff',
                        '#ff6666',
                        '#0000ff',
                        '#00cc99',
                        '#00e600'
                    ],
                    borderWidth: 2,
                    data: ___data
                  }
                ]
              }
            )
        }
    }

    useEffect(() => {
        
        dispatch(getAllStatistics())

    }, [])

    useEffect(() => {
        const getFinesByLicensePlate = async () => {
            if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
            }

            let result = await axios.get('license-penalty?status='+status);
            setLicensePenaltyList(result.data);
            setFilteredLicensePenaltyList(result.data)
        }

        getFinesByLicensePlate();
    }, [status])

    useEffect(() => {
        const getDirectoryFineList = async () => {
            if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
            }

            let result = await axios.get('directorate-fines?status='+status2);
            setdirectoryPenaltyList(result.data);
            setfilteredDirectoratePenaltyList(result.data)
        }

        getDirectoryFineList();
    }, [status2])

    useEffect(() => {
        const getDepartmentFineList = async () => {
            if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
            }

            let result = await axios.get('department-heads?status='+status3);
            setdepartmentPenaltyList(result.data);
            setfilteredDepartmentPenaltyList(result.data);
        }

        getDepartmentFineList();
    }, [status3])

    useEffect(() => {
        const getGeneralFineList = async () => {
            if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
            }

            let result = await axios.get('general-secretariats?status='+status4);
            setsecretariatsPenaltyList(result.data);
            setfilteredSecretariatsPenaltyList(result.data)
        }

        getGeneralFineList();
    }, [status4])


    const handleFilter = (e) => {
        const getStatus = e.target.value
        setStatus(getStatus)
        //setSelectedLicensePenalties([])
    }
    const handleFilter2 = (e) => {
        const getStatus = e.target.value
        setStatus2(getStatus)
        //setSelectedDirectoratePenalties([])
    }
    const handleFilter3 = (e) => {
        const getStatus = e.target.value
        setStatus3(getStatus)
        //setSelectedDepartmentPenalties([])
    }
    const handleFilter4 = (e) => {
        const getStatus = e.target.value
        setStatus4(getStatus)
        //setSelectedSecretariatsPenalties([])
    }

    const filterLicensePenalties = (searchText) => {
        const filteredList = licensePenaltyList.filter((item) => {
            if(searchText == ''){
                return item
            }else if(item.plate_number.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
            || item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())){
                return item
            }
        })
        setFilteredLicensePenaltyList(filteredList);
    }

    const filteredDirectorateList = (searchText) => {
        const filteredList = directoryPenaltyList.filter((item) => {
            if(searchText == ''){
                return item
            }else if(item.unit.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())){
                return item
            }
        })
        setfilteredDirectoratePenaltyList(filteredList)
    }

    const filtereDepartmentList = (searchText) => {
        const filteredList = departmentPenaltyList.filter((item) => {
            if(searchText == ''){
                return item
            }else if(item.department.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())){
                return item
            }
        })
        setfilteredDepartmentPenaltyList(filteredList)
    }

    const filtereSecretariatsList = (searchText) => {
        let filteredList = [];
        for (let item of secretariatsPenaltyList) {
            for (let department of item.departments) {
                if (department.boss.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || department.department.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || department.unit.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                    let index = filteredList.findIndex(listitem => listitem.boss === department.boss);
                    if (index > -1) {
                        filteredList[index].departments.push(department);
                    } else {
                        let newObj = {
                            boss: department.boss,
                            departments: [department]
                        }
                        filteredList.push(newObj);
                    }
                }
            }
        }
        setfilteredSecretariatsPenaltyList(filteredList);
    }

    const getLicensePenaltyData = () => {
        let columns = [
            {title: "PLAKA NUMARASI", width: {wpx: 180}, style: exportCommonStyle},
            {title: "İSİM SOYİSİM", width: {wpx: 280}, style: exportCommonStyle},
            {title: "ADET", width: {wpx: 140}, style: exportCommonStyle},
            {title: "TRAFİK CEZALARI", width: {wpx: 180}, style: exportCommonStyle}
        ];
        const data = [];
        const exportData = selectedLicensePenalties.length ? selectedLicensePenalties : filteredLicensePenaltyList;
        exportData.forEach((item, index) => {
            data.push(
                [
                    {
                        value: item.plate_number, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },{
                        value: item.name, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.total_count, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.amount, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    }
                ]
            )
        })

        let dataExport = [{
            columns: columns,
            data: data
        }];
        
        return dataExport
    }

    const getDirecoratePnaltyData = () => {
        let columns = [
            {title: "MÜDÜRLÜK", width: {wpx: 180}, style: exportCommonStyle},
            {title: "ADET", width: {wpx: 140}, style: exportCommonStyle},
            {title: "TRAFİK CEZALARI", width: {wpx: 180}, style: exportCommonStyle}
        ];
        const data = [];
        const exportData = selectedDirectoratePenalties.length ? selectedDirectoratePenalties : filteredDirectoratePenaltyList;
        exportData.forEach((item, index) => {
            data.push(
                [
                    {
                        value: item.unit, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.total_count, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.amount, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    }
                ]
            )
        })

        let dataExport = [{
            columns: columns,
            data: data
        }];
        
        return dataExport
    }

    const getDepartmentPenaltyData = () => {
        let columns = [
            {title: "DAİRE BAŞKANLIKLARI", width: {wpx: 180}, style: exportCommonStyle},
            {title: "ADET", width: {wpx: 140}, style: exportCommonStyle},
            {title: "TRAFİK CEZALARI", width: {wpx: 180}, style: exportCommonStyle}
        ];
        const data = [];
        const exportData = selectedDepartmentPenalties.length ? selectedDepartmentPenalties : filteredDepartmentPenaltyList;
        exportData.forEach((item, index) => {
            data.push(
                [
                    {
                        value: item.department, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.total_count, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.amount, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    }
                ]
            )
        })

        let dataExport = [{
            columns: columns,
            data: data
        }];
        
        return dataExport
    }

    const getSecretariatsPenaltyData = () => {
        let columns = [
            // {title: "Genel Sekreterlikler", width: {wpx: 280}, style: exportCommonStyle},
            {title: "DAİRE BAŞKANLIKLARI", width: {wpx: 420}, style: exportCommonStyle},
            // {title: "Unit", width: {wpx: 380}, style: exportCommonStyle},
            {title: "ADET", width: {wpx: 120}, style: exportCommonStyle},
            {title: "TRAFİK CEZALARI", width: {wpx: 180}, style: exportCommonStyle}
        ];
        
        const data = [];
        let exportData = [];
        if (selectedSecretariatsPenalties.length) {
            exportData = selectedSecretariatsPenalties;
        } else {
            for (let secretariate of filteredSecretariatsPenaltyList) {
                exportData.push(...secretariate.departments);
            }
        }
        
        let usedSecretariate = new Set();
        let usedDepartment = new Set();
        for (let item of exportData) {
            if (!usedSecretariate.has(item.boss)) {
                usedSecretariate.add(item.boss);
                data.push(
                    [
                        {
                            value: item.boss, 
                            style: secretariateExportHeaderStyle
                        },
                        { value: "", style: secretariateExportHeaderStyle },
                        { value: "", style: secretariateExportHeaderStyle },
                    ]
                )
            }
            if (!usedDepartment.has(item.department)){
                usedDepartment.add(item.department);
                data.push(
                    [
                        {
                            value: item.department, 
                            style: secretariateExportHeaderStyle
                        }
                    ]
                )
            }
            
            data.push(
                [
                    // {
                    //     value: item.department, 
                    //     style: {
                    //         font: {sz: "12", bold: false},
                    //         border: borderStyle,
                    //         alignment: alignmentStyle
                    //     }
                    // },
                    {
                        value: item.unit, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.total_count, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    },
                    {
                        value: item.amount, 
                        style: {
                            font: {sz: "12", bold: false},
                            border: borderStyle,
                            alignment: alignmentStyle
                        }
                    }
                ]
            );
        }

        let dataExport = [{
            columns: columns,
            data: data
        }];
        
        return dataExport
    }


    const ExportExcelFile = ({ data, fileName }) => {
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

    const ExportPlatePenalty = () => {
        const _licensePenalties = getLicensePenaltyData();

        return (
            <ExportExcelFile data={_licensePenalties} fileName={"plaka_cezalar_report"} />
        );
    }

    const ExportDirectoratePenalty = () => {
        const _directoratePenalties = getDirecoratePnaltyData();
        return (
            <ExportExcelFile data={_directoratePenalties} fileName={"müdürlük_cezalar_report"}/>
        )
    }
    
    const ExportDepartmentPenalty = () => {
        const _departmentPenalties = getDepartmentPenaltyData();
        return(
            <ExportExcelFile data={_departmentPenalties} fileName={"bölüm_başkanları_rport"}/>
        )
    }

    const ExportSecretariatsPenalty = () => {
        const _secretariatsPenalties = getSecretariatsPenaltyData();
        return(
            <ExportExcelFile data={_secretariatsPenalties} fileName={"genel_sekreterlikler_report"} />
        )
    }

    const toggleLicensePenaltySelection = (value) => {
        let list = selectedLicensePenalties.slice();
        let index = selectedLicensePenalties.findIndex(item => item.plate_number === value.plate_number && item.total_count === value.total_count && item.amount === value.amount);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(value);
        }
        setSelectedLicensePenalties(list);
    }

    const toggleDirectoratePenaltySelection = (value) => {
        let list = selectedDirectoratePenalties.slice();
        let index = selectedDirectoratePenalties.findIndex(item => item.unit === value.unit && item.total_count === value.total_count && item.amount === value.amount);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(value);
        }
        setSelectedDirectoratePenalties(list);
    }

    const toggleDepartmentPenaltySelection = (value) => {
        let list = selectedDepartmentPenalties.slice();
        let index = selectedDepartmentPenalties.findIndex(item => item.department === value.department && item.total_count === value.total_count && item.amount === value.amount);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(value);
        }
        setSelectedDepartmentPenalties(list);
    }

    const toggleSecretariatsPenaltySelection = (value) => {
        let list = selectedSecretariatsPenalties.slice();
        let index = selectedSecretariatsPenalties.findIndex(item => item.unit === value.unit && item.total_count === value.total_count && item.amount === value.amount);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(value);
        }
        setSelectedSecretariatsPenalties(list);
    }

    return (
        <div>
           {
                statisticsReducer.loading?
                    <ProgressSpinner />
                :
                <>
                    <Grid container spacing={1}>
                        {
                            summaryCardItems.map((item, index)=> 
                                <SummaryCards 
                                    key={index}
                                    color = {item.color} 
                                    title = {item.title}
                                    value = {item.value} 
                                    url = {item.url}
                                    icon = {item.icon}
                                />
                            )
                        }
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>
                                <Typography className={classes.header}>Plaka Cezalar</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField id="searchOne" onChange={event => {filterLicensePenalties(event.target.value)}}  label="Plaka Cezalarını Arayın" variant="outlined" style={{width: "100%"}} />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <select style={{float:"right", height: "56px"}} className='form-control' onChange={(e) => handleFilter(e)}>
                                            <option value="all">--TÜMÜ--</option>
                                            <option value="ÖDENDİ">ÖDENDİ</option>
                                            <option value="BEKLEMEDE">BEKLEMEDE</option>
                                            <option value="IPTAL EDILDI">IPTAL EDILDI</option>
                                        </select>
                                    </Grid>
                                    <Grid item xs={12} md={2} style={{textAlign:"right"}}>
                                        <ExportPlatePenalty />
                                    </Grid>
                                </Grid>

                                <Divider style={{margin: '15px 0',}}/>
                                <TableContainer style={{maxHeight: '440px'}}>
                                    <Table stickyHeader aria-label="Plaka Ceza Tablosu">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: 'bold', whiteSpace: 'nowrap'}} component="th">
                                                    seç
                                                    <Tooltip title="Clear Selection">
                                                        <IconButton onClick={() => setSelectedLicensePenalties([])} style={{color: '#ff0000', cursor: 'pointer'}}>
                                                            <Refresh />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">PLAKA NUMARASI</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">İSİM SOYİSİM</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">ADET</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">TRAFİK CEZALARI</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filteredLicensePenaltyList && filteredLicensePenaltyList.length && filteredLicensePenaltyList
                                                .map((item, index) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <FormControlLabel control={
                                                                <Checkbox value={item} checked={selectedLicensePenalties.some(selItem => selItem.plate_number === item.plate_number && selItem.total_count === item.total_count && selItem.amount === item.amount)} onChange={(e) => toggleLicensePenaltySelection(item)} />
                                                            } />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">{item.plate_number}</TableCell>
                                                        <TableCell align="left">{item.name}</TableCell>
                                                        <TableCell align="right">{item.total_count}</TableCell>
                                                        <TableCell align="right">{Number(item.amount).toLocaleString()} TL</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                            {
                                                !filteredLicensePenaltyList.length && (
                                                    <TableRow>
                                                        <TableCell>Kayıt Bulunamadı</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>
                                <Typography className={classes.header}>Müdürlük Cezalar</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField id="searchTwo" onChange={event => {filteredDirectorateList(event.target.value)}}  label="Müdürlük Cezalarını Arayın" variant="outlined" style={{width: "100%"}} />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <select style={{float:"right", height: "56px"}} className='form-control' onChange={(e) => handleFilter2(e)}>
                                            <option value="all">--TÜMÜ--</option>
                                            <option value="ÖDENDİ">ÖDENDİ</option>
                                            <option value="BEKLEMEDE">BEKLEMEDE</option>
                                            <option value="IPTAL EDILDI">IPTAL EDILDI</option>
                                        </select>
                                    </Grid>
                                    <Grid item xs={12} md={2} style={{textAlign:"right"}}>
                                        <ExportDirectoratePenalty />
                                    </Grid>
                                </Grid>

                                <Divider style={{margin: '15px 0',}}/>
                                <TableContainer style={{maxHeight: '440px'}}>
                                    <Table stickyHeader aria-label="Müdürlük Ceza Tablosu">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: 'bold', whiteSpace: 'nowrap'}} component="th">
                                                    seç
                                                    <Tooltip title="Clear Selection">
                                                        <IconButton onClick={() => setSelectedDirectoratePenalties([])} style={{color: '#ff0000', cursor: 'pointer'}}>
                                                            <Refresh />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">MÜDÜRLÜK</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">ADET</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">TRAFİK CEZALARI</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filteredDirectoratePenaltyList && filteredDirectoratePenaltyList.length && filteredDirectoratePenaltyList
                                                .filter((item) => {
                                                    if(searchFilterTwo == ''){
                                                        return item
                                                    }else if(item.unit.toLowerCase().includes(searchFilterTwo.toLowerCase())){
                                                        return item
                                                    }
                                                })
                                                .map((item, index) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <FormControlLabel control={
                                                                <Checkbox value={item} checked={selectedDirectoratePenalties.some(selItem => selItem.unit === item.unit && selItem.total_count === item.total_count && selItem.amount === item.amount)} onChange={(e) => toggleDirectoratePenaltySelection(item)} />
                                                            } />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">{item.unit}</TableCell>
                                                        <TableCell align="right">{item.total_count}</TableCell>
                                                        <TableCell align="right">{Number(item.amount || 0).toLocaleString()} TL</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                            {
                                                (!filteredDirectoratePenaltyList || !filteredDirectoratePenaltyList.length) && (
                                                    <TableRow>
                                                        <TableCell>Kayıt Bulunamadı</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>
                                <Typography className={classes.header}>Bölüm Başkanları</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField id="searchThree" onChange={event => {filtereDepartmentList(event.target.value)}}  label="Search" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <select style={{float:"right", height: "56px"}} className='form-control' onChange={(e) => handleFilter3(e)}>
                                            <option value="all">--TÜMÜ--</option>
                                            <option value="ÖDENDİ">ÖDENDİ</option>
                                            <option value="BEKLEMEDE">BEKLEMEDE</option>
                                            <option value="IPTAL EDILDI">IPTAL EDILDI</option>
                                        </select>
                                    </Grid>
                                    <Grid item xs={12} md={2} style={{textAlign:"right"}}>
                                        <ExportDepartmentPenalty />
                                    </Grid>
                                </Grid>

                                <Divider style={{margin: '15px 0',}}/>
                                <TableContainer style={{maxHeight: '440px'}}>
                                    <Table stickyHeader aria-label="Plaka Ceza Tablosu">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: 'bold', whiteSpace: 'nowrap'}} component="th">
                                                    seç
                                                    <Tooltip title="Clear Selection">
                                                        <IconButton onClick={() => setSelectedDepartmentPenalties([])} style={{color: '#ff0000', cursor: 'pointer'}}>
                                                            <Refresh />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">DAİRE BAŞKANLIKLARI</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">ADET</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">TRAFİK CEZALARI</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filteredDepartmentPenaltyList && filteredDepartmentPenaltyList.length && filteredDepartmentPenaltyList
                                                .filter((item) => {
                                                    if(searchFilterThree == ''){
                                                        return item
                                                    }else if(item.department.toLowerCase().includes(searchFilterThree.toLowerCase())){
                                                        return item
                                                    }
                                                })
                                                .map((item, index) => (
                                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell>
                                                            <FormControlLabel control={
                                                                <Checkbox value={item} checked={selectedDepartmentPenalties.some(selItem => selItem.department === item.department && selItem.total_count === item.total_count && selItem.amount === item.amount)} onChange={(e) => toggleDepartmentPenaltySelection(item)} />
                                                            } />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">{item.department}</TableCell>
                                                        <TableCell align="right">{item.total_count}</TableCell>
                                                        <TableCell align="right">{Number(item.amount).toLocaleString()} TL</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                            {
                                                !filteredDepartmentPenaltyList.length && (
                                                    <TableRow>
                                                        <TableCell>Kayıt Bulunamadı</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Paper style={{margin: '15px 0'}}>
                            <Typography className={classes.header}>Genel Sekreterlikler</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <TextField id="searchFour" onChange={event => {filtereSecretariatsList(event.target.value)}}  label="Search" variant="outlined" style={{width:"100%"}}/>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <select style={{float:"right", height: "56px"}} className='form-control' onChange={(e) => handleFilter4(e)}>
                                        <option value="all">--TÜMÜ--</option>
                                        <option value="ÖDENDİ">ÖDENDİ</option>
                                        <option value="BEKLEMEDE">BEKLEMEDE</option>
                                        <option value="IPTAL EDILDI">IPTAL EDILDI</option>
                                    </select>
                                </Grid>
                                <Grid item xs={12} md={2} style={{textAlign:"right"}}>
                                    <Tooltip title="Excel Aktar" aria-label="Export Excel Data" placement="top">
                                        <ExportSecretariatsPenalty />
                                    </Tooltip>
                                </Grid>
                            </Grid>

                                <Divider style={{margin: '15px 0',}}/>
                                <TableContainer style={{maxHeight: '440px'}}>
                                    <Table stickyHeader aria-label="Müdürlük Ceza Tablosu">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">Sekreter</TableCell>
                                                <TableCell style={{fontWeight: 'bold', whiteSpace: 'nowrap'}} component="th">
                                                    seç
                                                    <Tooltip title="Clear Selection">
                                                        <IconButton onClick={() => setSelectedSecretariatsPenalties([])} style={{color: '#ff0000', cursor: 'pointer'}}>
                                                            <Refresh />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">DAİRE BAŞKANLIKLARI</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th">MÜDÜRLÜK</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">ADET</TableCell>
                                                <TableCell style={{fontWeight: 'bold'}} component="th" align="right">TRAFİK CEZALARI</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        
                                        <TableBody>
                                            {
                                                filteredSecretariatsPenaltyList && filteredSecretariatsPenaltyList.length && filteredSecretariatsPenaltyList
                                                .filter((item) => {
                                                    if(searchFilterFour == ''){
                                                        return item
                                                    }else if(item.boss.toLowerCase().includes(searchFilterFour.toLowerCase())){
                                                        return item
                                                    }
                                                })
                                                .map((item, index) => (
                                                    <>
                                                        <TableRow key={item.boss + '_' + index}>
                                                            <TableCell style={{fontWeight: 'bold'}} component="th" colSpan={6}>{item.boss}</TableCell>
                                                        </TableRow> 
                                                        {
                                                            item.departments.map((dept, deptIndex) => 
                                                                (
                                                                    <TableRow key={dept.department + '_' + '_' + deptIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        <TableCell scope="row"></TableCell>
                                                                        <TableCell>
                                                                            <FormControlLabel control={
                                                                                <Checkbox value={dept} checked={selectedSecretariatsPenalties.some(selItem => selItem.unit === dept.unit && selItem.total_count === dept.total_count && selItem.amount === dept.amount )} onChange={(e) => toggleSecretariatsPenaltySelection(dept)} />
                                                                            } />
                                                                        </TableCell>
                                                                        <TableCell scope="row">{dept.department}</TableCell>
                                                                        <TableCell scope="row">{dept.unit}</TableCell>
                                                                        <TableCell align="right">{dept.total_count}</TableCell>
                                                                        <TableCell align="right">{Number(dept.amount || 0).toLocaleString()} TL</TableCell>
                                                                    </TableRow>
                                                                )
                                                            )
                                                        }
                                                    </>
                                                ))
                                            }
                                            {
                                                !filteredSecretariatsPenaltyList || !filteredSecretariatsPenaltyList.length && (
                                                    <TableRow>
                                                        <TableCell>Kayıt Bulunamadı</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>

                                <Typography className={classes.header}>Birim</Typography>
                                <Divider style={{margin: '15px 0',}}/>
                                <div  className={classes.chartCanvas}>
                                    <Bar
                                        data={getVehicleUnitGarageChartData()}
                                        options={{
                                            
                                            responsive:true,
                                            maintainAspectRatio: false,
                                            title:{
                                                display:true,
                                                text:'Birim',
                                                fontSize:12
                                            },
                                            legend:{
                                                display:true,
                                                position: 'right',
                                            },
                                        }}
                                    />

                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper style={{margin: '15px 0'}}>
                                <Typography className={classes.header}>Arac Sayisi</Typography>
                                <Divider style={{margin: '15px 0',}}/>
                                <div  className={classes.chartCanvas}>
                                    <Bar
                                        data={getvehicleTypeStats}
                                        options={{
                                            
                                            responsive:true,
                                            maintainAspectRatio: false,
                                            title:{
                                                display:true,
                                                text:'Arac Sayisi',
                                                fontSize:12
                                            },
                                            legend:{
                                                display:true,
                                                position: 'right',
                                            },
                                        }}
                                    />

                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
           }
        </div>
    )
}
