import React, { useEffect, useState } from 'react'
import Table from '../../shared_components/table';
// import { PenaltyTableHeader, PenaltyData } from '../../data/PenaltyData'
import MainActionContainer from '../../shared_components/MainActionContainer';
import BreadCrumb from '../../shared_components/BreadCrump';
import Paginator from '../../shared_components/Paginator';
import Modal from '../../shared_components/modal';
import pdf_logo from '../../../images/pdf_logo.jpg'
import { useNavigate, useParams } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import ProgressBarSpinner from '../../shared_components/ProgressBarSpinner'
import { getMenuInfo } from '../../../store/reducers/menu/menu.actions';
import { deleteMenuData, deleteMultipleMenuData, getMenuData, searchMenuData_data } from '../../../store/reducers/menu_data/menu_data.actions';
import { Avatar, Checkbox, FormControlLabel, IconButton } from '@material-ui/core';
import { Close, Delete, Edit } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import EditDataModal from '../../shared_components/EditDataModal';
import { excelFileType, formTypes, pageType }  from '../../../utils/constants'
import { formatUrlName, getPlaceHolderName, getTurkishDate }  from '../../../utils/functions'
import { useSnackbar } from 'notistack';
import TabPanel from '../../shared_components/TabPanel';
import ExcelFilePreview from '../../shared_components/ExcelFilePreview';

export default function AutoGenerateTable(props) {


    
    const { menu_id } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const [pdfOpen, setPdfOpen] = useState({
        open: false,
        pdf: null,
    });
    const [selectedData, setSelectedData] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const menuReducer = useSelector((state) => state.menuReducer)
    const menuDataReducer = useSelector((state) => state.menuDataReducer)
    const menuData = useSelector((state) => state.menuDataReducer.data)
    const authReducer = useSelector((state) => state.authReducer)
    const [tabValue, setTabValue] = React.useState(0);
    
    const [sortingValues, setSortingValues] = useState({
        sortBy: 'created_at',
        limitEntries:100,
        page: 1
    })

    const [editModalOpen, setEditModalOpen] = useState({
        open: false,
        data: {},
    })
    //checking if menu id is available in db

    if(!Array.isArray(menuReducer.singleMenuData) && Object.keys(menuReducer.singleMenuData).length === 0) {
        //menu is not in db
        navigate('/404')
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
        
        dispatch(getMenuInfo(menu_id))
        dispatch(getMenuData(menu_id,sortingValues.sortBy, sortingValues.page, sortingValues.limitEntries))

    }, [menu_id, sortingValues])


    useEffect(() => {
        
        handleEditDataModalClose()

    }, [menuDataReducer.data])
    
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
    
    const handleRefreshPage = ()=> {

        dispatch(getMenuData(menu_id))
    }
    
    const handleSearching = (data)=> {

        if(data.query !== '') {
            data.menu_id = menu_id
            dispatch(searchMenuData_data(data))
        }else {
            handleRefreshPage()
        }
    }

    
    const handleMultipleDelete = ()=>{
        showSnackBar("deleting data please wait..", "info")
        if('id' in authReducer.data) {
            let counter = 1
            deleteMultipleMenuData(authReducer.data.id, selectedData).then((data)=>{
                counter++
                if(counter == selectedData.split(",").length){
                    showSnackBar("data deleted successfully", "success")
                    dispatch(getMenuData(menu_id))
                }
            }).catch((err)=>{
                showSnackBar("could not delete all data", "error")
            })
        }
    }

    

    const handleDelete = (menuData_id)=> {
        if('id' in authReducer.data) {

            dispatch(deleteMenuData(authReducer.data.id, menuData_id, menu_id))
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

    function handleModalOpen(pdf){
        setPdfOpen({
            pdf: pdf,
            open : true,
        });
    };
    const handleModalClose = () => {
      setPdfOpen({
          ...pdfOpen,
          open: false
      });
    };   

    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        }
        
    ]

    if(menuReducer.singleMenuData.name) {
        links.push(
            {
                url:"/otomatik/veri/"+menuReducer.singleMenuData.name, 
                name: menuReducer.singleMenuData.name
            }
        )
    }

    
    const toggleCheckingAllCheckboxes = ()=> {

        const __selectedData = selectedData.split(',').length === 1 && selectedData.split(',')["0"]=== ''?[]:selectedData.split(',')
        if(__selectedData.length  === menuData.data.length) {
            setSelectedData([''].join())
        }else {
            const selected = menuData.data.map((item)=>item.id)
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
        return data.filter((item)=> selected.includes(item.id.toString()))
    }

    function formatData(data){
        const allData = []
        let formattedData = {}
        for(const key in data) {

            const __data = JSON.parse(data[key].data)
            formattedData['seç'] = <FormControlLabel control={
                <Checkbox name={data[key].id} value={data[key].id} checked={checkIfDataExists(data[key].id)} 
                    onChange={handleCheckBoxChange}/>
            } />
            for (const header in __data) {

                
                if(header.trim() === 'pdf') {
                    if(__data[header.trim()] === ''){
                        formattedData['pdf'.toUpperCase()] = ''
                    }else {

                        console.log(data['pdf_url'])
                        formattedData['pdf'.toUpperCase()] = <IconButton onClick={()=>handleModalOpen(__data[header.trim()])}> 
                                <Avatar alt="pdf logo" variant="square" src={pdf_logo} />
                            </IconButton>

                    }
                }else {
                    formattedData[header] = __data[header]
                }

                
            }
            formattedData[getPlaceHolderName("created_at", [])] = getTurkishDate(data[key].created_at)
            formattedData[getPlaceHolderName("updated_at", [])] = getTurkishDate(data[key].updated_at)
            
            formattedData["Tarafından eklendi"] = data[key]['added_by']['name'] + " " + data[key]['added_by']['surname']
            
            formattedData["AKSİYON".toUpperCase()] = <>
                    <IconButton color="primary" onClick={()=>handleEditDataModalOpen(data[key])}> <Edit /> </IconButton>
                    <IconButton style={{color: '#ff0000'}} onClick={()=>handleDelete(data[key].id)}> <Delete /> </IconButton>
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
        tableHeaders.splice(1, 0, "#");

        return tableHeaders
    }

    return (

        <div>
            <BreadCrumb links={links} />

            {
                ("name" in menuReducer.singleMenuData)?

                    <MainActionContainer 
                        // data={menuReducer.singleMenuData.name} 
                        data={{
                            type: menuReducer.singleMenuData.name,
                            menu_id: menuReducer.singleMenuData.id,
                            sortByOptions: [
                                "created_at",
                                "updated_at"
                            ]
                        }}
                        dataSet={formatData(formatExcelData( menuData.data))}
                        dataSetHeaders={getTableHeaders(formatData( menuData.data))}
                        handleSearching = {handleSearching}
                        handleRefreshPage={handleRefreshPage}
                        sortingValues={sortingValues}
                        handleLimitEntriesChange={handleLimitEntriesChange}
                        handleSortByChange={handleSortByChange}
                        toggleCheckingAllCheckboxes={toggleCheckingAllCheckboxes}
                        handleMultipleDelete={handleMultipleDelete}
                        handleTabChange={handleTabChange}
                        tabValue={tabValue}
                    />
                :<></>
            }
            
            <TabPanel value={tabValue} index={0}>
                {
                    menuDataReducer.loading?
                        <ProgressBarSpinner />
                    :

                    (!Array.isArray(menuReducer.singleMenuData))?
                        <>


                            {
                                ("data" in menuData)?
                                <>
                                    <Table rows= {formatData( menuData.data)} 
                                        tableHeader ={ getTableHeaders(formatData( menuData.data)) }/>
                                    <Paginator paginationCount={menuData.last_page} 
                                        handlePagination={handlePagination} 
                                        page={ menuData.current_page }
                                    />
                                    <EditDataModal 
                                        editModalOpen={editModalOpen}
                                        handleEditDataModalClose={handleEditDataModalClose}
                                        formType={formTypes.autoGenerateForm}
                                        page_type={formatUrlName(menuReducer.singleMenuData.name)}
                                    />

                                </>
                                :
                                <Alert severity="info">0 results found</Alert>
                            }
                            <Modal handleClose={handleModalClose} open={pdfOpen.open} pdf={pdfOpen.pdf} />

                        </>
                    :
                    <></>

                }
            </TabPanel>

            
            <TabPanel value={tabValue} index={1}>
                <ExcelFilePreview counter={tabValue} excelFileType={getExcelFileType({
                            type: menuReducer.singleMenuData.name,
                            menu_id: menuReducer.singleMenuData.id,
                            sortByOptions: [
                                "created_at",
                                "updated_at"
                            ]
                        })} />
            </TabPanel>

            
        </div>

    );



}
