import { LOGIN_USER_START, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER_LOGOUT } from '../actions/types';
let initialState = {
  user: null,
  error: null,
  isLoading: false
}
export default authReducer = (state = initialState, action) => {
  switch(action.type){
    case LOGIN_USER_START:

      return {...state, isLoading: true}
    case LOGIN_USER_SUCCESS:
      console.log('Loggato correttamente')
      return {...state, user: action.payload, isLoading: false}
    case LOGIN_USER_FAIL:
      console.log('login user fail')
      return {
        error: action.payload,
        isLoading: false
      }
    case LOGIN_USER_LOGOUT:
      console.log('logout users')
      return {
        user: null,
        error: null,
        isLoading: false
      }

    default:
      return state;
  }

}