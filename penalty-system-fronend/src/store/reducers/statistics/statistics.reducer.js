
import {
    CLEAR_STATISTICS_ERROR,
    LOADING_STATISTICS_DATA,
    SET_STATISTICS_DATA,
    SET_STATISTICS_ERROR,
} from './statistics.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const statisticsReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_STATISTICS_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_STATISTICS_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_STATISTICS_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_STATISTICS_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        
        default:
            return state;
    }
}