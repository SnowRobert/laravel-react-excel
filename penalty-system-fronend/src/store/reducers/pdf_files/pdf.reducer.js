
import {
    CLEAR_PDF_FILE_ERROR,
    CLEAR_PDF_FILE_MESSAGE,
    LOADING_PDF_FILE_DATA,
    SET_PDF_FILE_DATA,
    SET_PDF_FILE_MESSAGE,
    SET_PDF_FILE_ERROR
} from './pdf.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const pdfFileReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_PDF_FILE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_PDF_FILE_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_PDF_FILE_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_PDF_FILE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        
        case SET_PDF_FILE_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };

        case CLEAR_PDF_FILE_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };
        
        default:
            return state;
    }
}