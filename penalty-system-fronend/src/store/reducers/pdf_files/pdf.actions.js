
import axios from 'axios'


import {
    CLEAR_PDF_FILE_ERROR,
    LOADING_PDF_FILE_DATA,
    SET_PDF_FILE_DATA,
    SET_PDF_FILE_MESSAGE,
    SET_PDF_FILE_ERROR
} from './pdf.types'



const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllPdfFiles = (page_type, sort_by = 'created_at', page = 1, perPage = 10000000) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PDF_FILE_DATA })
    axios.get('pdf-file?page_type='+page_type+'&per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        
        dispatch({ type: CLEAR_PDF_FILE_ERROR})
        dispatch({
            type: SET_PDF_FILE_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_PDF_FILE_ERROR,
            payload: error.response.data
        })
    })

}

export const setPdfFiles = (data, user_id) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PDF_FILE_DATA })
    axios.post('users/'+user_id+'/pdf-file', data)
    .then((res)=>{
        
        dispatch({ type: CLEAR_PDF_FILE_ERROR})   
        dispatch({
            type: SET_PDF_FILE_MESSAGE,
            payload: res.data.message
        })
        dispatch(getAllPdfFiles())


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_PDF_FILE_ERROR,
            payload: error.response.data
        })
    })

}



export const searchPdf = (file_name,sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_PDF_FILE_DATA })
    axios.get('pdf-file-search?file_name='+file_name+'&per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{
        
        dispatch({ type: CLEAR_PDF_FILE_ERROR})
        dispatch({
            type: SET_PDF_FILE_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_PDF_FILE_ERROR,
            payload: error.response.data
        })
    })

}