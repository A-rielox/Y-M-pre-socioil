import React, { useReducer, useContext } from 'react';
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
   SET_EDIT_JOB,
   DELETE_JOB_BEGIN,
   EDIT_JOB_BEGIN,
   EDIT_JOB_SUCCESS,
   EDIT_JOB_ERROR,
   SHOW_STATS_BEGIN,
   SHOW_STATS_SUCCESS,
   CLEAR_FILTERS,
} from './actions';

import { statusList, jobTypeList } from '../utils/optionLists.js';

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
   // stats
   stats: {},
   monthlyApplications: [],
   // search & sort
   search: '',
   searchStatus: 'all',
   searchType: 'all',
   sort: 'latest',
   sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
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

   // cambia DINÁMICAMENTE VALORES EN EL STATE
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

   // los q estan en url es xq siempre tienen un valor x defecto, el search es opcional xlo q puede ser undefined
   const getJobs = async () => {
      const { search, searchStatus, searchType, sort } = state;

      let url = `/recetas?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

      if (search) {
         url = url + `&search=${search}`;
      }

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

         // logoutUser();
      }
      clearAlert();
   };

   // al picarle a editar ==> se meten los valores de ese trabajo en el state y se manda a la pag de crear-job con estos valores pre-llenados, aqui se editan y se manda el patch a la DB ( el "editar" está en Job.js )
   const setEditJob = id => {
      dispatch({ type: SET_EDIT_JOB, payload: { id } });
   };

   const editJob = async () => {
      dispatch({ type: EDIT_JOB_BEGIN });

      try {
         const { position, company, jobLocation, jobType, status } = state;

         await authFetch.patch(`/recetas/${state.editJobId}`, {
            position,
            company,
            jobLocation,
            jobType,
            status,
         });

         dispatch({
            type: EDIT_JOB_SUCCESS,
         });

         dispatch({ type: CLEAR_VALUES });
      } catch (error) {
         if (error.response.status === 401) return;

         dispatch({
            type: EDIT_JOB_ERROR,
            payload: { msg: error.response.data.msg },
         });
      }

      clearAlert();
   };

   const deleteJob = async jobId => {
      dispatch({ type: DELETE_JOB_BEGIN });

      try {
         await authFetch.delete(`/recetas/${jobId}`);

         getJobs();
      } catch (error) {
         console.log(error.response);

         // logoutUser();
      }

      console.log(`delete : ${jobId}`);
   };

   const showStats = async () => {
      dispatch({ type: SHOW_STATS_BEGIN });

      try {
         const { data } = await authFetch('/recetas/stats');

         dispatch({
            type: SHOW_STATS_SUCCESS,
            payload: {
               stats: data.defaultStats,
               monthlyApplications: data.monthlyApplications,
            },
         });
      } catch (error) {
         console.log(error.response);
         // logoutUser()
      }
      clearAlert();
   };

   const clearFilters = () => {
      dispatch({ type: CLEAR_FILTERS });
   };

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
            setEditJob,
            deleteJob,
            editJob,
            clearAlert,
            showStats,
            clearFilters,
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
