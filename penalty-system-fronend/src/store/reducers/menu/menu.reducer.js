
import {
    CLEAR_MENU_ERROR,
    CLEAR_MENU_MESSAGE,
    LOADING_MENU_DATA,
    SET_SINGLE_MENU_DATA,
    SET_MENU_ENTRIES_DATA,
    SET_MENU_DATA,
    SET_MENU_ERROR,
    SET_MENU_MESSAGE,
} from './menu.types'


const initialState = {
    loading: false,
    data: {},
    menuEntries: [],
    singleMenuData: [],
    errors: null,
    message: null,
  };
export const menuReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_MENU_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };

        case SET_SINGLE_MENU_DATA:
            return {
                ...state,
                singleMenuData: action.payload,
                loading: false,
            };

        case SET_MENU_ENTRIES_DATA:
            return {
                ...state,
                menuEntries: action.payload,
                loading: false,
            };
        
        
        case CLEAR_MENU_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_MENU_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_MENU_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case SET_MENU_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };
        case CLEAR_MENU_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };


        
        default:
            return state;
    }
}