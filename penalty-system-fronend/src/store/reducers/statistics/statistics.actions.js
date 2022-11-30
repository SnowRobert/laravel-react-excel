
import axios from 'axios'


import {
    CLEAR_STATISTICS_ERROR,
    LOADING_STATISTICS_DATA,
    SET_STATISTICS_DATA,
    SET_STATISTICS_ERROR,
} from './statistics.types'



const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllStatistics = () => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_STATISTICS_DATA })
    axios.get('statistics')
    .then((res)=>{
        console.log("@getAllStatistics=====================================================");
        console.log(res);
        dispatch({ type: CLEAR_STATISTICS_ERROR})
        dispatch({
            type: SET_STATISTICS_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {
        
        dispatch({
            type: SET_STATISTICS_ERROR,
            payload: error.response.data
        })
    })

}
