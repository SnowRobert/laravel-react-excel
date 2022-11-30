
import {
    CLEAR_MENU_DATA_ERROR,
    CLEAR_MENU_DATA_MESSAGE,
    LOADING_MENU_DATA_DATA,
    SET_MENU_DATA_DATA,
    SET_MENU_DATA_ERROR,
    SET_MENU_DATA_MESSAGE
} from './menu_data.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const menuDataReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_MENU_DATA_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_MENU_DATA_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_MENU_DATA_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_MENU_DATA_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case SET_MENU_DATA_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };
        case CLEAR_MENU_DATA_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };


        
        default:
            return state;
    }
}