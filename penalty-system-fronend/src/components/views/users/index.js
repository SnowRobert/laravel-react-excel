import React, { useEffect,  useState } from 'react'
import Table from '../../shared_components/table';
import MainActionContainer from '../../shared_components/MainActionContainer';
import BreadCrumb from '../../shared_components/BreadCrump';
import Paginator from '../../shared_components/Paginator';
import { excelFileType, pageType }  from '../../../utils/constants'
import { useDispatch,useSelector } from 'react-redux';
import { getAllUsersData, searchUsersData } from '../../../store/reducers/users/user.actions';
import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, MenuItem, } from '@material-ui/core';
import { Close, Delete } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import { getPlaceHolderName,getTurkishDate } from '../../../utils/functions'
import { signUpTextfields } from '../../../utils/constants'
import ProgressBarSpinner from '../../shared_components/ProgressBarSpinner'
import Alert from '@material-ui/lab/Alert';
import TabPanel from '../../shared_components/TabPanel';
import ExcelFilePreview from '../../shared_components/ExcelFilePreview';
import axios from 'axios';
import { useSnackbar } from 'notistack';


export default (props) => {
    
    const dispatch = useDispatch()
    const userReducer = useSelector((state) => state.userReducer)
    const [tabValue, setTabValue] = React.useState(0);
    const [selectedData, setSelectedData] = useState('')
    const userData = useSelector((state) => state.userReducer.data)
    const authState = useSelector((state) => state.authReducer)
    const currentUser = authState.data;
    const [sortingValues, setSortingValues] = useState({
        sortBy: 'created_at',
        limitEntries:100,
        page: 1
    })


  
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
      
      

    useEffect(() => {

        dispatch(getAllUsersData(sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries))

    }, [sortingValues])

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
    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/personel", 
            name: "kullanıcı ekle"
        }
        
    ]

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
    const handleDelete = (data)=> {
        showSnackBar('Silme işlemi devam ediyor')
        axios.delete('users/'+data)
            .then(() => {
                showSnackBar('Başarıyla Silindi','success')
                dispatch(getAllUsersData(sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries))
            });
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

                if(header !== 'id' && header !== 'email_verified_at' && header !== 'verification_token') {
                    if(header.trim().toLowerCase() === 'verified') {
                        const placeholder = isTurkish?'Eposta Doğrulama':'verified'
                        formattedData[placeholder] =  (data[key]['verified'])?"doğrulandı": "Doğrulanmadı"
                    }else if(header.trim().toLowerCase() === 'profile_img') {
                        const placeholder = isTurkish?'profil resmi':'profile_img'
                        formattedData[placeholder] = <Avatar alt={data[key]['name']} src={data[key][header]} />
                    }else if(header.trim() === 'created_at' || header.trim() === 'updated_at'){                        
                        const placeholder = isTurkish?getPlaceHolderName(header, signUpTextfields):header
                        formattedData[placeholder] = getTurkishDate(data[key][header])
                    }else {
                        const placeholder = isTurkish?getPlaceHolderName(header, signUpTextfields):header
                        formattedData[placeholder] = data[key][header]
                    }
                }

            }
                        
            formattedData['Silmek'] = <FormControlLabel control={
                (
                    currentUser && currentUser.id != data[key].id &&
                    currentUser.role != 'USER' && 
                    ( <Delete style={{color: '#ff0000'}} onClick={()=>handleDelete(data[key].id)} /> )
                )
                || 
                <></>
            
            } />  
            
            allData.push(formattedData)
            formattedData = {}

        }

        return allData
    }

    function getTableHeaders(data){
        const tableHeaders = ["#"]
        for(const key in data) {
            
            for (const header in data[key]) {
                tableHeaders.push(header)
            }
            break

        }

        return tableHeaders
    }

    const handleRefreshPage = ()=> {

        dispatch(getAllUsersData())
    }
    const handleSearching = (data)=> {

        if(data.query !== '') {
            const formData = new FormData()
            formData.append('value', data.query.toLowerCase())

            dispatch(searchUsersData(formData))
        }else {
            handleRefreshPage()
        }
    }

    const toggleCheckingAllCheckboxes = ()=> {

        const __selectedData = selectedData.split(',').length === 1 && selectedData.split(',')["0"]=== ''?[]:selectedData.split(',')
        if(__selectedData.length  === userData.data.length) {
            setSelectedData([''].join())
        }else {
            const selected = userData.data.map((item)=>item.id)
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
    const formatSortHeaders = () => {

        const headers = getTableHeaders(formatData( userData.data, false))
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
        if(headers.includes('profile_img')) {
            const index = headers.indexOf('profile_img');
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
    return (

        <>
            <div>
                <BreadCrumb links={links} />
                <MainActionContainer 
                    data={formatMainActionData(pageType.users)}
                    dataSet={formatData(formatExcelData( userData.data))}
                    dataSetHeaders={getTableHeaders(formatData( userData.data))}
                    sortingValues={sortingValues}
                    handleSearching = {handleSearching}
                    handleRefreshPage={handleRefreshPage}
                    handleLimitEntriesChange={handleLimitEntriesChange}
                    handleSortByChange={handleSortByChange}
                    toggleCheckingAllCheckboxes={toggleCheckingAllCheckboxes}
                    handleTabChange={handleTabChange}
                    tabValue={tabValue}
                />

                <TabPanel value={tabValue} index={0}>
                    {
                        userReducer.loading?
                            <ProgressBarSpinner />
                        :
                        ("data" in userData)?
                        <>
                            <Table rows= {formatData( userData.data)} 
                                tableHeader ={ getTableHeaders(formatData( userData.data)) }
                            />
                            <Paginator paginationCount={userData.last_page} 
                                handlePagination={handlePagination} 
                                page={ userData.current_page }
                            />

                        </>
                        :
                        <Alert severity="info">0 results found</Alert>
                    }
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ExcelFilePreview counter={tabValue} excelFileType={getExcelFileType(formatMainActionData(pageType.users))} />
                </TabPanel>

            </div>
        </>
    );
}
