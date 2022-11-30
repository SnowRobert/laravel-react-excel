
import {
    CLEAR_EXCEL_FILE_ERROR,
    CLEAR_EXCEL_FILE_MESSAGE,
    LOADING_EXCEL_FILE_DATA,
    SET_EXCEL_FILE_DATA,
    SET_EXCEL_FILE_MESSAGE,
    SET_EXCEL_FILE_ERROR
} from './excelFiles.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const excelFileReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_EXCEL_FILE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_EXCEL_FILE_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_EXCEL_FILE_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_EXCEL_FILE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        
        case SET_EXCEL_FILE_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };

        case CLEAR_EXCEL_FILE_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };
        
        default:
            return state;
    }
}