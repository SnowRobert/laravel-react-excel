
import {
    CLEAR_VEHICLE_ERROR,
    CLEAR_VEHICLE_MESSAGE,
    LOADING_VEHICLE_DATA,
    SET_VEHICLE_DATA,
    SET_VEHICLE_ERROR,
    SET_VEHICLE_MESSAGE,
    SET_VEHICLE_PLATES_DATA,
} from './vehicle.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
    allVehiclePlates: [],
  };
export const vehicleReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_VEHICLE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        case SET_VEHICLE_PLATES_DATA:
            return {
                ...state,
                allVehiclePlates: action.payload,
                loading: false,
            };
        
        
        case CLEAR_VEHICLE_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_VEHICLE_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_VEHICLE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case SET_VEHICLE_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };
        case CLEAR_VEHICLE_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };


        
        default:
            return state;
    }
}