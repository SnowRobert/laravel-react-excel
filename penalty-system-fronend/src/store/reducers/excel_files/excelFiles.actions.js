
import axios from 'axios'


import {
    CLEAR_EXCEL_FILE_ERROR,
    CLEAR_EXCEL_FILE_MESSAGE,
    LOADING_EXCEL_FILE_DATA,
    SET_EXCEL_FILE_DATA,
    SET_EXCEL_FILE_MESSAGE,
    SET_EXCEL_FILE_ERROR
} from './excelFiles.types'



const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllFiles = (page_type, sort_by = 'created_at', page = 1, perPage = 10000000) => (dispatch) => {
    
    setAuthorizationHeader()
    dispatch({ type: LOADING_EXCEL_FILE_DATA })
    axios.get('excel-file?page_type='+page_type+'&per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        console.log("first")
        console.log(res)
        dispatch({ type: CLEAR_EXCEL_FILE_ERROR})
        dispatch({
            type: SET_EXCEL_FILE_DATA,
            payload: ("data" in res)?res.data:[]
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_EXCEL_FILE_ERROR,
            payload: error.response.data
        })
    })

}

export const setExcelFiles = (data, user_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_EXCEL_FILE_DATA })
    axios.post('users/'+user_id+'/excel-file', data)
    .then((res)=>{
        
        dispatch({ type: CLEAR_EXCEL_FILE_ERROR})   
        dispatch({
            type: SET_EXCEL_FILE_MESSAGE,
            payload: res.data.message
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_EXCEL_FILE_ERROR,
            payload: error.response.data
        })
    })

}


export const downloadFile = (file_id) => new Promise((successCallBack, errorCallBack)=>{

    // setAuthorizationHeader()
        console.log(file_id)
    axios.get('excel-files/download/'+file_id, {
        responseType: 'blob',    
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' : 'attachment; filename=excel.xlsx'
        }
      })
    .then((res)=>{
        console.log("res.data")
        console.log(res.data)
        // successCallBack(window.URL.createObjectURL(new Blob([res.data])))
        successCallBack(res.data)


    })
    .catch((error)=> {
        
        errorCallBack(error.response.data)
        // dispatch({
        //     type: SET_EXCEL_FILE_ERROR,
        //     payload: error
        // })
    })

})