import React, { useEffect,useState } from 'react'
import Table from '../../shared_components/table';
import MainActionContainer from '../../shared_components/MainActionContainer';
import BreadCrumb from '../../shared_components/BreadCrump';
import EditDataModal from '../../shared_components/EditDataModal';
import Paginator from '../../shared_components/Paginator';
import { pageType, formTypes, vehicleTextFields, excelFileType }  from '../../../utils/constants'
import { getPlaceHolderName,getTurkishDate } from '../../../utils/functions'
import { useDispatch,useSelector } from 'react-redux';
import { deleteMultipleVehicles, deleteVehicle, getAllVehicles, searchVehiclesData } from '../../../store/reducers/vehicle/vehicle.actions';
import { Close, Delete, Edit } from '@material-ui/icons';
import { Checkbox, FormControlLabel, IconButton, MenuItem } from '@material-ui/core';
import ProgressBarSpinner from '../../shared_components/ProgressBarSpinner'
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import PenaltyMenu from '../penalty/actionBtns';
import TabPanel from '../../shared_components/TabPanel';
import ExcelFilePreview from '../../shared_components/ExcelFilePreview';

export default (props) => {
    const dispatch = useDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const authReducer = useSelector((state) => state.authReducer)
    const currentUser = authReducer.data;
    const vehicleReducer = useSelector((state) => state.vehicleReducer);
    const vehicleData = vehicleReducer.data;
    const [selectedData, setSelectedData] = useState('');
    const [tabValue, setTabValue] = React.useState(0);
    const [editModalOpen, setEditModalOpen] = useState({
        open: false,
        data: {},
    })
     
    const [sortingValues, setSortingValues] = useState({
        sortBy: 'created_at',
        limitEntries:100,
        page: 1
    })
    
    useEffect(() => {
        
        dispatch(getAllVehicles(sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries))

    }, [sortingValues])
    
    useEffect(() => {
        
        handleEditDataModalClose()

    }, [vehicleReducer.data])


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

    const handleSortByChange = (event) => {
        setSortingValues(
            {
                ...sortingValues,
                sortBy: event.target.value,
            }
        );
    };

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
    
        
    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/arac", 
            name: "Araç ekle"
        }
        
    ]


    const handleRefreshPage = ()=> {

        dispatch(getAllVehicles())
    }
    const handleSearching = (data)=> {

        if(data.query != '') {
            const formData = new FormData()
            formData.append('value', data.query.toLowerCase())

            dispatch(searchVehiclesData(formData))
        }else {
            handleRefreshPage()
        }
    }

    

    const handleMultipleDelete = ()=>{
        showSnackBar("deleting data please wait..", "info")
        if('id' in authReducer.data) {
            let counter = 1
            deleteMultipleVehicles(authReducer.data.id, selectedData).then((data)=>{
                counter++
                if(counter == selectedData.split(",").length){
                    showSnackBar("data deleted successfully", "success")
                    dispatch(getAllVehicles())
                }
            }).catch((err)=>{
                showSnackBar("could not delete all data", "error")
            })
        }
    }

    const handleDelete = (vehicle_id)=> {
        if('id' in authReducer.data) {

            dispatch(deleteVehicle(authReducer.data.id, vehicle_id))
        }

    }

    
    function formatData(data, isTurkish = true){
        const allData = []
        let formattedData = {}
        for(const key in data) {

            formattedData['seç'] = <FormControlLabel control={
                <Checkbox name={data[key].id} value={data[key].id} checked={checkIfDataExists(data[key].id)} 
                    onChange={handleCheckBoxChange}/>
            } />
            for (const header in data[key]) {

                

                if(header != 'id' && header != 'added_by') {

                    if(header.trim() === 'created_at' || header.trim() === 'updated_at'){
                        
                        const placeholder = isTurkish?getPlaceHolderName(header, vehicleTextFields):header
                        formattedData[placeholder] = getTurkishDate(data[key][header])
                    }else {

                        const placeholder = isTurkish?getPlaceHolderName(header, vehicleTextFields):header
                        formattedData[placeholder] = data[key][header]
                    }
                }

                
            }
            const placeholder1 = isTurkish?'Tarafından eklendi'.toUpperCase():"added_by"
            formattedData[placeholder1] = data[key]['added_by']['name'] + " " + data[key]['added_by']['surname']
            
            const placeholder = isTurkish?'AKSİYON'.toUpperCase():"action"
            formattedData[placeholder] = <>
            
                <PenaltyMenu>
                    {
                        currentUser && currentUser.role != 'USER' && 
                        (
                            <>
                                <MenuItem><IconButton color="primary" onClick={()=>handleEditDataModalOpen(data[key])}> <Edit /> </IconButton></MenuItem>
                                <MenuItem><IconButton style={{color: '#ff0000'}} onClick={()=>handleDelete(data[key].id)}> <Delete /> </IconButton></MenuItem>
                            </>
                        )
                    }
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

    const formatSortHeaders = () => {

        const headers = getTableHeaders(formatData( vehicleData.data, false))
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
        if(headers.includes('profile')) {
            const index = headers.indexOf('profile');
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

        data.sortByOptions = formatSortHeaders();
        return data;
    }

    const toggleCheckingAllCheckboxes = ()=> {

        const __selectedData = selectedData.split(',').length === 1 && selectedData.split(',')["0"]=== ''?[]:selectedData.split(',')
        if(__selectedData.length  === vehicleData.data.length) {
            setSelectedData([''].join())
        }else {
            const selected = vehicleData.data.map((item)=>item.id)
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
    const formatExcelData = (data) => {
        
        const selected = selectedData.split(',')
        if(!Array.isArray(data)) {
            return []
        }
        return data.filter((item)=> {
            if(selected.includes(item.id.toString())) {
                return item;
            }
        })
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

        <>
            <div>

                <BreadCrumb links={links} />
                <MainActionContainer 
                    data={formatMainActionData(pageType.vehicle)}
                    dataSet={formatData(formatExcelData( vehicleData.data))}
                    dataSetHeaders={getTableHeaders(formatData( vehicleData.data))}
                    sortingValues={sortingValues}
                    handleSearching = {handleSearching}
                    handleRefreshPage={handleRefreshPage}
                    handleLimitEntriesChange={handleLimitEntriesChange}
                    handleSortByChange={handleSortByChange}
                    toggleCheckingAllCheckboxes={toggleCheckingAllCheckboxes}
                    handleMultipleDelete={handleMultipleDelete}
                    handleTabChange={handleTabChange}
                    tabValue={tabValue}
                />
                
                    <TabPanel value={tabValue} index={0}>
                        {
                            vehicleReducer.loading?
                                <ProgressBarSpinner />
                            :("data" in vehicleData)?
                            <>
                                
            
                                <Table rows= {formatData( vehicleData.data)} 
                                    tableHeader ={ getTableHeaders(formatData( vehicleData.data)) }/>
                                <Paginator paginationCount={vehicleData.last_page} 
                                    handlePagination={handlePagination} 
                                    page={ vehicleData.current_page }
                                />
                                <EditDataModal 
                                    editModalOpen={editModalOpen}
                                    handleEditDataModalClose={handleEditDataModalClose}
                                    formType={formTypes.newVehicle}
                                />

                            </>
                            :
                            <Alert severity="info">0 results found</Alert>
                        }
                    </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ExcelFilePreview counter={tabValue} excelFileType={getExcelFileType(formatMainActionData(pageType.vehicle))} />
                </TabPanel>

            </div>

        </>

    );



}
