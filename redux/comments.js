import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      // return {...state, errMess: null, comments: action.payload};
      return Object.assign({}, state, {
        isLoading: false, 
        errMess: null, 
        comments: action.payload
      });

    case ActionTypes.COMMENTS_FAILED:
      // return {...state, errMess: action.payload};
      return Object.assign({}, state, {
        isLoading: false, 
        errMess: action.payload, 
      });

    default:
      return state;
  }
};