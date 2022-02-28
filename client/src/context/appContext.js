import React, { useReducer, useContext, useEffect } from 'react';
import reducer from './reducer';
import axios from 'axios';
import {
   DISPLAY_ALERT,
   CLEAR_ALERT,
   REGISTER_USER_BEGIN,
   REGISTER_USER_SUCCESS,
   REGISTER_USER_ERROR,
   LOGIN_USER_BEGIN,
   LOGIN_USER_SUCCESS,
   LOGIN_USER_ERROR,
   TOGGLE_SIDEBAR,
   LOGOUT_USER,
   UPDATE_USER_BEGIN,
   UPDATE_USER_SUCCESS,
   UPDATE_USER_ERROR,
   HANDLE_CHANGE,
   CLEAR_VALUES,
   CREATE_JOB_BEGIN,
   CREATE_JOB_SUCCESS,
   CREATE_JOB_ERROR,
   GET_JOBS_BEGIN,
   GET_JOBS_SUCCESS,
} from './actions';

import { statusList, jobTypeList } from '../utils/optionLists.js';
/* 

3067 de readme

*/
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

export const initialState = {
   isLoading: false,
   // alerta
   showAlert: true,
   alertText: '',
   alertType: '',
   // para login o register
   user: user ? JSON.parse(user) : null,
   token: token,
   userLocation: userLocation || '' /* ❌ */,
   jobLocation: userLocation || '' /* ❌ */,
   //sidebar
   showSidebar: false,
   // create job ( TODO LO DE JOBSCHEMA )
   isEditing: false,
   editJobId: '',
   company: '',
   position: '',
   statusOptions: statusList,
   status: 'pending',
   jobTypeOptions: jobTypeList,
   jobType: 'full-time',
   // para obtener todos los jobs
   jobs: [],
   totalJobs: 0,
   numOfPages: 1,
   page: 1,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialState);

   // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   // ⭐⭐  para axios ( Axios - Setup Instance )
   const authFetch = axios.create({
      baseURL: '/api/v1',
   });

   //  para axios req interceptor
   authFetch.interceptors.request.use(
      config => {
         config.headers.common['Authorization'] = `Bearer ${state.token}`;
         return config;
      },
      error => {
         return Promise.reject(error);
      }
   );

   //  para axios response interceptor
   authFetch.interceptors.response.use(
      response => {
         return response;
      },
      error => {
         // esta es la gracia, poder customizar para los distintos errores, y YO controlar la respuesta ente los errores
         if (error.response.status === 401) {
            logoutUser();
            console.log('desde interceptor res: ERROR 401');
         }
         return Promise.reject(error);
      }
   );

   // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

   const displayAlert = () => {
      dispatch({ type: DISPLAY_ALERT });
      clearAlert();
   };

   const clearAlert = () => {
      setTimeout(() => {
         dispatch({ type: CLEAR_ALERT });
      }, 3000);
   };

   const addUserToLocalStorage = ({ user, token, location }) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('location', location);
   };

   const removeUserFromLocalStorage = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('location');
   };

   const registerUser = async currentUser => {
      dispatch({ type: REGISTER_USER_BEGIN });

      try {
         const { data } = await axios.post(
            '/api/v1/auth/register',
            currentUser
         );

         const { user, token, location } = data;

         dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: { user, token, location },
         });

         addUserToLocalStorage({
            user,
            token,
            location,
         });
      } catch (error) {
         dispatch({
            type: REGISTER_USER_ERROR,
            payload: { msg: error.response.data.msg },
         });
      }

      clearAlert();
   };

   const loginUser = async currentUser => {
      dispatch({ type: LOGIN_USER_BEGIN });

      try {
         const { data } = await axios.post('/api/v1/auth/login', currentUser);

         const { user, token, location } = data;

         dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: { user, token, location },
         });

         addUserToLocalStorage({
            user,
            token,
            location,
         });
      } catch (error) {
         dispatch({
            type: LOGIN_USER_ERROR,
            payload: { msg: error.response.data.msg },
         });
      }
      clearAlert();
   };

   const toggleSidebar = () => {
      dispatch({ type: TOGGLE_SIDEBAR });
   };

   const logoutUser = () => {
      dispatch({ type: LOGOUT_USER });
      removeUserFromLocalStorage();
   };

   const updateUser = async currentUser => {
      dispatch({ type: UPDATE_USER_BEGIN });

      try {
         // ⭐⭐
         const { data } = await authFetch.patch(
            '/auth/updateUser',
            currentUser
         );

         const { user, token, location } = data;

         dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: { user, token, location },
         });

         addUserToLocalStorage({ user, token, location });
      } catch (error) {
         if (error.response.status === 401) {
            dispatch({
               type: UPDATE_USER_ERROR,
               payload: { msg: error.response.data.msg },
            });
         }
      }
      clearAlert();
   };

   const handleChange = ({ name, value }) => {
      dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
   };

   const clearValues = () => {
      dispatch({ type: CLEAR_VALUES });
   };

   const createJob = async () => {
      dispatch({ type: CREATE_JOB_BEGIN });

      try {
         // saco todo del state
         const { position, company, jobLocation, jobType, status } = state;

         await authFetch.post('/recetas', {
            position,
            company,
            jobLocation,
            jobType,
            status,
         });

         dispatch({ type: CREATE_JOB_SUCCESS });

         dispatch({ type: CLEAR_VALUES });
      } catch (error) {
         // el "if" es para no tener la alerta dando vuelta ( q no se mande )
         if (error.response.status === 401) return;

         dispatch({
            type: CREATE_JOB_ERROR,
            payload: { msg: error.response.data.msg },
         });
      }
      clearAlert();
   };

   const getJobs = async () => {
      let url = `/recetas`;

      dispatch({ type: GET_JOBS_BEGIN });

      try {
         const { data } = await authFetch.get(url);
         const { jobs, totalJobs, numOfPages } = data;

         dispatch({
            type: GET_JOBS_SUCCESS,
            payload: { jobs, totalJobs, numOfPages },
         });
      } catch (error) {
         console.log(error.response);

         logoutUser();
      }
      clearAlert();
   };

   useEffect(() => {
      getJobs();
   }, []);

   return (
      <AppContext.Provider
         value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser,
            updateUser,
            handleChange,
            clearValues,
            createJob,
            getJobs,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export const useAppContext = () => {
   return useContext(AppContext);
};

export { AppProvider };

// ⭐⭐ config para axios
//
// const authFetch = axios.create({
//    baseURL: '/api/v1',
//    headers: {
//       Authorization: `Bearer ${state.token}`,
//    },
// });
//
// para no tener q repetir en todos el tercer parametro de la config
// const { data } = await axios.patch(
//    '/api/v1/auth/updateUser',
//    currentUser,
//    {
//       headers: { 🥊 se quita por el interceptor
//          Authorization: `Bearer ${state.token}`,
//       },
//    }
// );
//
// para ocuparlo se va a poner authFetch.post ( o .loQueSea ) en lugar de axios.loQueSea
//
// Axios - Interceptors son como los "middlewares" q van a agarrar las reqs y res al salir y llegar para poner le más funcionalidad ( lo saqué de documentacion axios interceptors )

// You can intercept requests or responses before they are handled by then or catch.

// // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   });

// se pueden usar directamente sobre axios o como en este caso sobre la instancia "authFetch"
