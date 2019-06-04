import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            // for each element in the state array
            //  if element is action.payload 
            //    return
            // else add action payload to the state
            // in short add action payload to the state if 
            // it isn't there already 
            if (state.some(el => el === action.payload))
                return state;
            else
                return state.concat(action.payload);
        case ActionTypes.DELETE_FAVORITE:
            return state.filter((favorite) => favorite !== action.payload);            
        default:
          return state;
      }
};