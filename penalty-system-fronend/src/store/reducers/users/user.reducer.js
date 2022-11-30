
import {
    CLEAR_ERROR,
    LOADING_USER_DATA,
    CLEAR_MESSAGE,
    SET_DATA,
    SET_ERROR,
    SET_MESSAGE
} from './user.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const userReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_USER_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };


        
        default:
            return state;
    }
}