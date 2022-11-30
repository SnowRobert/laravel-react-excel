import {
    FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper,
    Select, Tooltip, Typography, Divider, Box,
    Tabs, Tab
} from '@material-ui/core'
import {Add, CheckBox, Delete, Print, Refresh} from '@material-ui/icons';
import React, {useState} from 'react'
import {useStyles, BootstrapInput} from './style';
import {pageType} from '../../../utils/constants'
import {useNavigate} from 'react-router-dom';
import ColumnSelectionModal from '../columnSelectionModal';
import SearchBar from "material-ui-search-bar";
import SearchIcon from '@material-ui/icons/Search';
import {formatUrlName} from '../../../utils/functions'
import {excelFileType} from '../../../utils/constants'
import ImportExcelData from '../ImportExcelData'
import AllExcelFiles from '../ExcelFilePreviewModal'
import MoreVert from '@material-ui/icons/MoreVert';
import { useSelector } from 'react-redux';


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function MainActionContainer(props) {

    const {
        data,
        dataSet,
        dataSetHeaders,
        sortingValues,
        handleSearching,
        handleRefreshPage,
        handleSortByChange,
        handleLimitEntriesChange,
        handlePayFilterChange,
        toggleCheckingAllCheckboxes,
        handleMultipleDelete,
        tabValue,
        handleTabChange
    } = props;
    const classes = useStyles();
    const navigate = useNavigate();
    const authState = useSelector((state) => state.authReducer)
    const currentUser = authState.data;
    const [anchorEl, setAnchorEl] = useState(null);
    const [columnSelectionOpen, setColumnSelectionOpen] = useState(false);
    const [searchQueryValue, setSearchQueryValue] = useState('')
    const limitEntriesData = ["100", "300", "500", "1000", "All"];
    const payFilterData = [{key: "all", value: "Tümü"}, {key: "payed", value: "ÖDENDİ"},
        {key: "pending", value: "BEKLEMEDE"}, {key: "canceled", value: "İPTAL EDİLDİ"}];
    const sortByData = data.sortByOptions;
    const isMenuOpen = Boolean(anchorEl);


    const handleFormOpen = () => {

        //data

        if (data === pageType.vehicle) {
            navigate('/arac-ekle');
        } else if (data === pageType.users) {
            navigate('/personel-ekle');
        } else if (data === pageType.penalty) {
            navigate('/ceza-ekle');
        } else {

            localStorage.setItem("menu_id", data.menu_id)
            navigate('/otomatik/form/' + formatUrlName(data.type.toLowerCase()))
        }
    }

    const handleSearchBarChange = (value) => {
        setSearchQueryValue(value)
    }

    const handleSearchButtonClick = () => {
        handleSearching({query: searchQueryValue})
    }


    const handleColumnSelectionOpen = () => {
        setColumnSelectionOpen(true);
    };

    const handleColumnSelectionClose = () => {
        setColumnSelectionOpen(false);
    };

    const getExcelFileType = () => {

        //data

        if (data === pageType.vehicle) {
            return excelFileType.vehicle
        } else if (data === pageType.penalty) {
            return excelFileType.penalty
        } else {

            return data.type.toLowerCase()
        }
    }
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const menuId = 'more-menus';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

            <ImportExcelData excelFileType={getExcelFileType()}/>
            {/* <AllExcelFiles excelFileType={getExcelFileType()} /> */}
        </Menu>
    );


    return (

        <Paper className={classes.root} style={{marginBottom: "20px"}}>


            <Grid container spacing={1}>
                
                    {
                        currentUser && currentUser.role != 'USER' && 
                        (
                            <Grid item xs={2} md={1}>
                                <Tooltip title="Yeni ekle" aria-label="add" placement="top">

                                    <IconButton
                                        variant="contained"
                                        color="white"
                                        onClick={handleFormOpen}
                                        className={classes.whiteButton}
                                    ><Add/> {/*data.type*/}</IconButton>
                                </Tooltip>
                            </Grid>
                        )
                    }

                <Grid item xs={2} md={1}>

                    <Tooltip title="Excel Yazdir" aria-label="export" placement="top">
                        <IconButton variant="contained"
                                    color="primary"
                                    onClick={handleColumnSelectionOpen}
                                    className={classes.whiteButton}
                        >
                            <Print/>
                        </IconButton>
                    </Tooltip>

                </Grid>
                <Grid item xs={2} md={1}>

                    <Tooltip title="Yenile" aria-label="refresh page" placement="top">
                        <IconButton variant="contained"
                                    color="primary"
                                    onClick={handleRefreshPage}
                                    className={classes.whiteButton}
                        >
                            <Refresh/>
                        </IconButton>
                    </Tooltip>

                </Grid>

                <Grid item xs={2} md={1}>

                    <Tooltip title="Tümünü Seç" aria-label="select all rows" placement="top">
                        <IconButton variant="contained"
                                    color="primary"
                                    onClick={toggleCheckingAllCheckboxes}
                                    className={classes.whiteButton}
                        >
                            <CheckBox/>
                        </IconButton>

                    </Tooltip>

                </Grid>
                {
                    currentUser && currentUser.role != 'USER' && 
                    (
                        handleMultipleDelete ?
                        <Grid item xs={2} md={1}>
    
                            <Tooltip title="silmek" aria-label="Delete" placement="top">
                                <IconButton variant="contained"
                                        color="primary"
                                        onClick={handleMultipleDelete}
                                        className={classes.whiteButton}
                                >
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
    
                        </Grid>
                        : ""
                    )
                }
                <Grid item xs={2} md={1}>

                    <Tooltip title="Upload Excel" aria-label="Import Excel Data" placement="top">
                        <IconButton
                            aria-label="show more"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            variant="contained"
                            color="primary"
                            className={classes.whiteButton}
                        >
                            <MoreVert/>
                        </IconButton>

                    </Tooltip>

                </Grid>
                <Grid item xs={12} md={(currentUser && currentUser.role != 'USER' && 3) || 5}>


                    <Grid container>

                        <Grid item xs={9}>
                            <SearchBar
                                value={searchQueryValue}
                                onChange={(newValue) => handleSearchBarChange(newValue)}
                                onRequestSearch={handleSearchButtonClick}
                                placeholder={"Arama... "}
                            />
                        </Grid>

                        {

                            searchQueryValue !== '' ?
                                <Grid item xs={1}>

                                    <IconButton
                                        aria-label="show more"
                                        // aria-controls={mobileMenuId}
                                        aria-haspopup="true"
                                        onClick={handleSearchButtonClick}
                                        className={classes.iconButton}
                                        variant="contained"
                                        color="primary"
                                        // className={classes.whiteButton}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </Grid>
                                : <></>
                        }

                    </Grid>


                </Grid>
                <Grid item xs={12} md={1}>
                    <div className={classes.entries} style={{display: 'block', width: '120px'}}>

                        <Typography variant="body2" style={{fontSize: '13px'}}>Giriş Gösteriliyor</Typography>
                        <Select
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            value={sortingValues.limitEntries}
                            onChange={handleLimitEntriesChange}
                            input={<BootstrapInput/>}
                        >

                            {

                                limitEntriesData.map((item, index) => <MenuItem key={index}
                                                                                value={item}>{item}</MenuItem>)

                            }
                        </Select>
                    </div>
                </Grid>
                <Grid item xs={12} md={1}>
                    <div className={classes.entries} style={{display: 'block', width: '120px'}}>

                        <Typography variant="body2" style={{fontSize: '13px'}}>ÖDEME DURUMU</Typography>
                        <Select
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            value={sortingValues.payStatus}
                            onChange={handlePayFilterChange}
                            input={<BootstrapInput/>}
                        >

                            {

                                payFilterData.map((item, index) => <MenuItem key={index}
                                                                                value={item.key}>{item.value}</MenuItem>)

                            }
                        </Select>
                    </div>
                </Grid>
                {/*<Grid item xs={12} md={1} style={{paddingLeft: "30px"}}>*/}

                {/*    <FormControl className={classes.formControl}>*/}
                {/*        <InputLabel id="demo-simple-select-label" style={{color: 'white'}}>Göre Sırala:</InputLabel>*/}
                {/*        <Select*/}
                {/*            labelId="demo-simple-select-label"*/}
                {/*            id="demo-simple-select"*/}
                {/*            value={sortingValues.sortBy}*/}
                {/*            onChange={handleSortByChange}*/}
                {/*            style={{color: 'white', borderBottom: '1px solid #fff'}}*/}
                {/*        >*/}


                {/*            {*/}

                {/*                sortByData.map((item, index) => (*/}
                {/*                    <MenuItem key={index} value={item}>{item}</MenuItem>*/}
                {/*                ))*/}
                {/*            }*/}
                {/*        </Select>*/}
                {/*    </FormControl>*/}


                {/*</Grid>*/}

                <Grid item md={12} xs={12} style={{display: 'none'}}>
                    <Divider style={{margin: "5px 0"}}/>

                    <Box>
                        <Tabs value={tabValue} onChange={handleTabChange}
                              indicatorColor="white"
                              textColor="white"
                              variant="scrollable"
                              scrollButtons="auto"
                              aria-label="simple tabs example"
                        >
                            <Tab label="Listeler" {...a11yProps(0)} />
                            <Tab label="Excel Belgeleri" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                </Grid>
            </Grid>

            <ColumnSelectionModal
                open={columnSelectionOpen}
                handleClose={handleColumnSelectionClose}
                dataType={data}
                dataSet={dataSet}
                dataSetHeaders={dataSetHeaders}
            />


            {renderMenu}

        </Paper>
    );

}
