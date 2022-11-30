import React, { useEffect,useState } from 'react'
import Table from '../../shared_components/table';
import penaltyDataTypes from './penaltyDataTypes';
// import { PenaltyTableHeader, PenaltyData } from '../../data/PenaltyData'
import MainActionContainer from '../../shared_components/MainActionContainer';
import BreadCrumb from '../../shared_components/BreadCrump';
import Paginator from '../../shared_components/Paginator';
import Modal from '../../shared_components/modal';
import { penaltyTextFields, formTypes, pageType, excelFileType }  from '../../../utils/constants'
import { getPlaceHolderName, getTurkishDate } from '../../../utils/functions'
import pdf_logo from '../../../images/pdf_logo.jpg'
import { Avatar, Button, Checkbox,  FormControlLabel, IconButton, InputLabel } from "@material-ui/core";
import { Close, Delete, Edit, Info } from '@material-ui/icons';
import { useDispatch,useSelector } from 'react-redux';
import { deleteMultiplePenalty, deletePenalty, getAllPenalties, searchPenaltiesData, setFilteredPenaltyData } from '../../../store/reducers/penalty/penalty.actions';
import ProgressBarSpinner from '../../shared_components/ProgressBarSpinner'
import Alert from '@material-ui/lab/Alert';
import EditDataModal from '../../shared_components/EditDataModal';
import MoreDetailsModal from '../../shared_components/MoreDetailsModal';
import ImageModal from '../../shared_components/ImageModal'
import { useSnackbar } from 'notistack';
import PenaltyMenu from './actionBtns'
import MenuItem from '@mui/material/MenuItem';
import TabPanel from '../../shared_components/TabPanel';
import ExcelFilePreview from '../../shared_components/ExcelFilePreview';
import { FormControl, Select } from '@mui/material';
import { SET_PENALTY_DATA } from '../../../store/reducers/penalty/penalty.types';

export default function Penalty(props) {


    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [tabValue, setTabValue] = React.useState(0);
    const [pdfOpen, setPdfOpen] = useState({
        open: false,
        pdf: null,
    });
    const [selectedData, setSelectedData] = useState('');
    const dispatch = useDispatch();
    const authReducer = useSelector((state) => state.authReducer);
    const currentUser = authReducer.data;
    const penaltyReducer = useSelector((state) => state.penaltyReducer);
    const penaltyData = penaltyReducer.data;
    const [sortingValues, setSortingValues] = useState({
        sortBy: 'created_at',
        limitEntries:100,
        page: 1,
        payStatus: "all"
    })
    const [editModalOpen, setEditModalOpen] = useState({
        open: false,
        data: {},
    })
    const [searchQuery, setSearchQuery] = useState('');
    const [secretariat, setSecretariat] = useState('');
    const [department, setDepartment] = useState('');
    const [directorate, setDirectorate] = useState('');



    function handleModalOpen(pdf){
        setPdfOpen({
            pdf: pdf,
            // pdf: '/demo1.pdf',
            open : true,
        });
    };
    const handleModalClose = () => {
      setPdfOpen({
          ...pdfOpen,
          open: false
      });
    };
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    const handleEditDataModalOpen = (data) => {
        setEditModalOpen({
            data: data,
            open:true,
        });
    };

    const handleEditDataModalClose = () => {
        setEditModalOpen({
            ...editModalOpen,
            open:false,
        });
    };

    useEffect(() => {
        if (searchQuery) {
            const formData = new FormData()
            formData.append('value', searchQuery.trim())
            dispatch(searchPenaltiesData(formData, sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, sortingValues.payStatus))
        } else {
            if(secretariat != ''){
                const formData = new FormData()
                if(department == ''){
                    formData.append('value', secretariat)
                } else if (directorate == ''){
                    formData.append('value', department)
                } else {
                    formData.append('value', directorate)
                }
                dispatch(searchPenaltiesData(formData, sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, sortingValues.payStatus))
            } else {
                dispatch(getAllPenalties(sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, sortingValues.payStatus))
            }
        }


    }, [sortingValues])

    useEffect(() => {

        handleEditDataModalClose()

    }, [])

    const handlePagination = (page) => {
        setSortingValues({
            ...sortingValues,
            page: page
        })
    }

    const handleLimitEntriesChange = (event) => {
        setSortingValues(
            {
                ...sortingValues,
                limitEntries: event.target.value,
            }
        );
    };

    const handlePayFilterChange = async (event) => {
        
        event.preventDefault(); 
        await setSortingValues(
            {
                ...sortingValues,
                payStatus: event.target.value,
            }
        );    
        const formData = new FormData()
        if(secretariat !== ''){
            if(department === ''){
                await formData.append('value', secretariat)
            }
            else if (directorate === ''){
                await formData.append('value', department)
            }
            else {
                await formData.append('value', directorate)
            }
            await dispatch(searchPenaltiesData(formData, sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, event.target.value))
        }
    };
    const handleSecretariatChange = (e) => {
        setSortingValues(
            {
                ...sortingValues,
                secretariat: secretariat
            }
        )
    };
    const handleDepartmentChange = (e) => {
        setSortingValues(
            {
                ...sortingValues,
                department: department
            }
        )
    };
    const handleDirectorateChange = (e) => {
        setSortingValues(
            {
                ...sortingValues,
                directorate: directorate
            }
        )
    }

    const handleSortByChange = (event) => {
        setSortingValues(
            {
                ...sortingValues,
                sortBy: event.target.value,
            }
        );
    };

    const handleMultipleDelete = ()=>{
        showSnackBar("deleting data please wait..", "info")
        if('id' in authReducer.data) {
            deleteMultiplePenalty(authReducer.data.id, selectedData).then((data)=>{
                showSnackBar("data deleted successfully", "success")
                if (sortingValues.limitEntries === 'All') {
                    window.location.reload(false);
                } else {
                    let _penalty = penaltyData.data.filter(item => !selectedData.includes(`${item.id}`) )
                    penaltyData.data = _penalty;
                    dispatch(setFilteredPenaltyData(penaltyData))
                }
                //dispatch(getAllPenalties(sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries))
                setSelectedData("");
            }).catch((err)=>{
                console.log('delete-error:', err);
                showSnackBar("could not delete all data", "error")
            })
        }
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

    const handleDelete = (penalty_id)=> {
        if('id' in authReducer.data) {
            dispatch(deletePenalty(authReducer.data.id, penalty_id))
        }

    }

    const links = [
        {
            url:"/ana-sayfa",
            name: "Anasayfa"
        },
        {
            url:"/ceza",
            name: "Ceza ekle"
        }

    ]

    const handleRefreshPage = ()=> {

        dispatch(getAllPenalties())
    }
    const handleSearching = (data)=> {

        console.log('handle-searching:', data);
        if(data.query !== '') {
            setSearchQuery(data.query.trim());
            const formData = new FormData()
            formData.append('value', data.query.trim())

            dispatch(searchPenaltiesData(formData, sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, sortingValues.payStatus))
        }else {
            setSearchQuery('');
            handleRefreshPage()
        }
    }

    const toggleCheckingAllCheckboxes = ()=> {
        const selected_data = selectedData === ''?[]:selectedData.split(',')
        if(selected_data.length  === penaltyData.data.length) {
            setSelectedData([''].join())
        }else {
            const selected = penaltyData.data.map((item)=>item.id)
            console.log(selected.join())
            setSelectedData(selected.join())
        }

    }
    const handleCheckBoxChange = (e)=> {
        const value = e.target.value
        let selected = selectedData.split(',')
        selected = (selected['0'] === "")?[]:selected

        if(checkIfDataExists(e.target.value)) {
            const index = selected.indexOf(value);
            if (index > -1) {
                selected.splice(index, 1);
            }
        }else {
            selected.push(value)
        }
        setSelectedData(selected.join())
    }

    function checkIfDataExists(data) {
        return selectedData.split(',').includes(data.toString())
    }
    function formatData(data, isTurkish = true,isTableData = false){
        const allData = []
        let formattedData = {}
        for(const key in data) {

            formattedData['seç'] = <FormControlLabel control={
                <Checkbox name={data[key].id} value={data[key].id} checked={checkIfDataExists(data[key].id)}
                    onChange={handleCheckBoxChange}/>
            } />
            for (const header in data[key]) {


                if(header !== 'id' && header !== 'added_by') {

                    if(header.trim() === 'pdf_url') {

                        const placeholder = isTurkish?'pdf'.toUpperCase():'pdf'
                        if(data[key][header] === ''){
                            formattedData[placeholder] = ''
                        }else {
                            formattedData[placeholder] = <IconButton onClick={()=>handleModalOpen(data[key][header])}>
                                    <Avatar alt="pdf logo" variant="square" src={pdf_logo} />
                                </IconButton>

                        }
                    }else if(header.trim() === 'image_url') {

                        const placeholder = isTurkish?'Ö.MAKBUZ'.toUpperCase():'image'
                        if(data[key][header] === ''){
                            formattedData[placeholder] = ''
                        }else {
                            formattedData[placeholder] = <ImageModal image={data[key][header]} />

                        }
                    }else if(header.trim() === 'created_at' || header.trim() === 'updated_at'){

                        const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                        formattedData[placeholder] = getTurkishDate(data[key][header])
                    }else if(header.trim() ===  'plate_number') {

                        const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                        formattedData[placeholder] = data[key][header]
                    }else if(header.trim() ===  'status') {

                        const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                        formattedData[placeholder] = data[key][header]
                    }else if(header.trim() ===  'name') {


                        const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                        formattedData[placeholder] = data[key][header]
                    }else if(header.trim() ===  'receipt_number') {

                        const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                        formattedData[placeholder] = data[key][header]
                    }else {

                        if(!isTableData){
                            const placeholder = isTurkish?getPlaceHolderName(header, penaltyTextFields):header
                            formattedData[placeholder] = data[key][header]
                        }
                    }
                }


            }


            const placeholder1 = isTurkish?'Tarafından eklendi'.toUpperCase():"added_by"
            formattedData[placeholder1] = data[key]['added_by']['name'] + " " + data[key]['added_by']['surname']


            const placeholder = isTurkish?'AKSİYON'.toUpperCase():"action"
            formattedData[placeholder] = <>
                    <PenaltyMenu>
                        <MenuItem><MoreDetailsModal data={data[key]} textfields={penaltyTextFields}/></MenuItem>
                        {
                        currentUser && currentUser.role != 'USER' && 
                        (
                            <>
                                <MenuItem><IconButton color="primary" onClick={()=>handleEditDataModalOpen(data[key])}> <Edit /> </IconButton></MenuItem>
                                <MenuItem><IconButton style={{color: '#ff0000'}} onClick={()=>handleDelete(data[key].id)}> <Delete /> </IconButton></MenuItem>
                            </>
                        )}
                    </PenaltyMenu>
                </>
            allData.push(formattedData)
            formattedData = {}

        }

        return allData
    }

    function getTableHeaders(data){
        const tableHeaders = []
        for(const key in data) {

            for (const header in data[key]) {
                tableHeaders.push(header)
            }
            break

        }


        tableHeaders.splice(1, 0, "#")

        return tableHeaders
    }

    const formatMoreData = () => {

        const headers = getTableHeaders(formatData( penaltyData.data, false))
        // removing unwanted cols
        if(headers.includes('#')) {
            const index = headers.indexOf('#');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('pdf')) {
            const index = headers.indexOf('pdf');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('penalty_date')) {
            const index = headers.indexOf('penalty_date');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('payment_date')) {
            const index = headers.indexOf('payment_date');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('action')) {
            const index = headers.indexOf('action');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('select')) {
            const index = headers.indexOf('select');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }
        if(headers.includes('seç')) {
            const index = headers.indexOf('seç');
            if (index > -1) {
                headers.splice(index, 1);
            }
        }


        return headers;
    }
    const formatMainActionData = (data) => {

        data.sortByOptions = formatMoreData();

        return data;
    }

    const formatExcelData = (data) => {

        console.log('formatExcelData', data);

        const selected = selectedData.split(',')
        if(!Array.isArray(data)) {
            return []
        }
        return data.filter((item)=> (selected.includes(item.id.toString())))
    }

    const getExcelFileType = (data) => {

        //data

        if(data === pageType.vehicle ) {
            return excelFileType.vehicle
        }else if(data === pageType.penalty ) {
            return excelFileType.penalty
        }else {

            return data.type.toLowerCase()
        }
    }

    const handleFilter = async (e) => {
        e.preventDefault();     
        const formData = new FormData()
        if(secretariat != ''){
            if(department == ''){
                await formData.append('value', secretariat)
            }
            else if (directorate == ''){
                await formData.append('value', department)
            }
            else {
                await formData.append('value', directorate)
            }
            await dispatch(searchPenaltiesData(formData, sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries, sortingValues.payStatus))
        }        
    }

    return (

        <div id="test123">
            {/* <PdfViewerComponent document={'MA82085522.pdf'} /> */}
            <BreadCrumb links={links} />
            <MainActionContainer
                data={formatMainActionData(pageType.penalty)}
                dataSet={formatData(formatExcelData( penaltyData.data))}
                dataSetHeaders={getTableHeaders(formatData( penaltyData.data))}
                sortingValues={sortingValues}
                handleSearching = {handleSearching}
                handleRefreshPage={handleRefreshPage}
                handleLimitEntriesChange={handleLimitEntriesChange}
                handlePayFilterChange={handlePayFilterChange}
                handleSortByChange={handleSortByChange}
                toggleCheckingAllCheckboxes={toggleCheckingAllCheckboxes}
                handleMultipleDelete={handleMultipleDelete}
                handleTabChange={handleTabChange}
                tabValue={tabValue}
            />


            <form onSubmit={handleFilter}>
                <FormControl variant="filled" style={{display:"flex", flexFlow:"row", alignItems:"center"}}>
                    <InputLabel id='sec'>Genel Sekreterliği seçiniz</InputLabel>
                    <Select onChange={(e)=>setSecretariat(e.target.value)} id='sec' name='secretariat' style={{minWidth:"250px", marginLeft:"7px"}}>
                        <MenuItem  value='' style={{color:'gray'}}>Genel Sekreterliği seçiniz</MenuItem >
                        {penaltyDataTypes.map((filter)=>(
                            <MenuItem  value={filter.secretariat}>{filter.secretariat}</MenuItem>
                        ))}
                    </Select>


                {secretariat != '' && (
                    <>
                        <InputLabel htmlFor='dep' style={{marginLeft:"7px"}}>Daire Başkanlığını seçiniz</InputLabel>
                        <Select onChange={(e)=>setDepartment(e.target.value)} id='dep' name='department' style={{minWidth:"250px", marginLeft:"7px"}}>
                            <MenuItem value='' style={{color:'gray'}}>Daire Başkanlığını seçiniz</MenuItem>
                            {penaltyDataTypes.map((filter)=>(
                                filter.secretariat === secretariat && (
                                    filter.departments.map((depart)=>(
                                        <MenuItem value={depart.department}>{depart.department}</MenuItem>
                                    ))
                                )
                            ))}
                        </Select>
                    </>
                )}
                
                {department != '' && (
                    <>
                    <InputLabel htmlFor='dir' style={{marginLeft:"7px"}}>Şube Müdürlüğünü seçiniz</InputLabel>
                    <Select onChange={(e)=>setDirectorate(e.target.value)} id='dir' name='directorate' style={{minWidth:"250px", marginLeft:"7px"}}>
                        <MenuItem value='' style={{color:'gray'}}>Şube Müdürlüğünü seçiniz</MenuItem>
                        {penaltyDataTypes.map((filter)=>(
                            filter.secretariat === secretariat && (
                                filter.departments.map((depart)=>(
                                    depart.department === department && (
                                        depart.subunits.map((sub)=>(
                                            <MenuItem value={sub}>{sub}</MenuItem>
                                        ))
                                    )
                                ))
                            )
                        ))}
                    </Select>
                    </>
                )}
                
                </FormControl>
                <Button variant="contained" type='submit' value='Filter' style={{float:"right", marginTop:"14px", marginBottom:"20px"}}>Filter</Button>
            </form>

            <TabPanel value={tabValue} index={0}>

                {
                    penaltyReducer.loading?
                        <ProgressBarSpinner />
                    :
                        ("data" in penaltyData) ?
                        <>
                            <Table rows= {formatData( penaltyData.data,true, true)}
                                tableHeader ={ getTableHeaders(formatData( penaltyData.data,true, true)) }/>
                            {
                                sortingValues.limitEntries === 'All' ? <div/> :
                                <Paginator paginationCount={penaltyData.last_page}
                                    handlePagination={handlePagination}
                                    page={ penaltyData.current_page }
                                />
                            }
                        </>
                        :
                        <Alert severity="info">0 results found</Alert>
                }
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <ExcelFilePreview counter={tabValue} excelFileType={getExcelFileType(formatMainActionData(pageType.penalty))} />
            </TabPanel>


            <Modal handleClose={handleModalClose} open={pdfOpen.open} pdf={pdfOpen.pdf} />
            <EditDataModal
                editModalOpen={editModalOpen}
                handleEditDataModalClose={handleEditDataModalClose}
                formType={formTypes.newPenalty}
            />
        </div>

    );



}
