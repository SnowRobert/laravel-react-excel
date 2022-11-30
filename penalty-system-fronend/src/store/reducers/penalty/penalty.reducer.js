
import {
    CLEAR_PENALTY_ERROR,
    CLEAR_PENALTY_MESSAGE,
    LOADING_PENALTY_DATA,
    SET_PENALTY_DATA,
    SET_PENALTY_ERROR,
    SET_PENALTY_MESSAGE,
} from './penalty.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const penaltyReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_PENALTY_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_PENALTY_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_PENALTY_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_PENALTY_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case SET_PENALTY_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };
        case CLEAR_PENALTY_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };


        
        default:
            return state;
    }
}