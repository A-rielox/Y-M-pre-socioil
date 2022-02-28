import { initialState } from './appContext';

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
} from './actions';

const reducer = (state, action) => {
   if (action.type === DISPLAY_ALERT) {
      return {
         ...state,
         showAlert: true,
         alertType: 'danger',
         alertText: 'Por favor rellenar todos los campos...🤦',
      };
   }

   if (action.type === CLEAR_ALERT) {
      return {
         ...state,
         showAlert: false,
         alertType: '',
         alertText: '',
      };
   }
   //

   if (action.type === REGISTER_USER_BEGIN) {
      return {
         ...state,
         isLoading: true,
      };
   }

   if (action.type === REGISTER_USER_SUCCESS) {
      return {
         ...state,
         isLoading: false,
         user: action.payload.user,
         token: action.payload.token,
         userLocation: action.payload.location,
         jobLocation: action.payload.location,
         showAlert: true,
         alertType: 'success',
         alertText: 'Usuario creado exitosamente...👍',
      };
   }

   if (action.type === REGISTER_USER_ERROR) {
      return {
         ...state,
         isLoading: false,
         showAlert: true,
         alertType: 'danger',
         alertText: action.payload.msg,
      };
   }
   //
   if (action.type === LOGIN_USER_BEGIN) {
      return {
         ...state,
         isLoading: true,
      };
   }
   if (action.type === LOGIN_USER_SUCCESS) {
      return {
         ...state,
         isLoading: false,
         user: action.payload.user,
         token: action.payload.token,
         userLocation: action.payload.location,
         jobLocation: action.payload.location,
         showAlert: true,
         alertType: 'success',
         alertText: 'Usuario ingresado exitosamente...👍',
      };
   }
   if (action.type === LOGIN_USER_ERROR) {
      return {
         ...state,
         isLoading: false,
         showAlert: true,
         alertType: 'danger',
         alertText: action.payload.msg,
      };
   }
   //

   if (action.type === TOGGLE_SIDEBAR) {
      return {
         ...state,
         showSidebar: !state.showSidebar,
      };
   }

   if (action.type === LOGOUT_USER) {
      return {
         ...initialState,
         user: null,
         token: null,
         userLocation: '',
         jobLocation: '',
      };
   }
   //
   if (action.type === UPDATE_USER_BEGIN) {
      return { ...state, isLoading: true };
   }

   if (action.type === UPDATE_USER_SUCCESS) {
      return {
         ...state,
         isLoading: false,
         token: action.payload.token,
         user: action.payload.user,
         userLocation: action.payload.location,
         jobLocation: action.payload.location,
         showAlert: true,
         alertType: 'success',
         alertText: 'Perfil actualizado con exito 👍',
      };
   }

   if (action.type === UPDATE_USER_ERROR) {
      return {
         ...state,
         isLoading: false,
         showAlert: true,
         alertType: 'danger',
         alertText: action.payload.msg,
      };
   }

   if (action.type === HANDLE_CHANGE) {
      const { name, value } = action.payload;

      return { ...state, [name]: value };
   }

   if (action.type === CLEAR_VALUES) {
      // todos los valores de job en appContext
      const initialState = {
         isEditing: false,
         editJobId: '',
         position: '',
         company: '',
         jobLocation: state.userLocation,
         jobType: 'full-time',
         status: 'pending',
      };
      return { ...state, ...initialState };
   }
   //

   if (action.type === CREATE_JOB_BEGIN) {
      return { ...state, isLoading: true };
   }

   if (action.type === CREATE_JOB_SUCCESS) {
      return {
         ...state,
         isLoading: false,
         showAlert: true,
         alertType: 'success',
         alertText: 'New Job Created!',
      };
   }

   if (action.type === CREATE_JOB_ERROR) {
      return {
         ...state,
         isLoading: false,
         showAlert: true,
         alertType: 'danger',
         alertText: action.payload.msg,
      };
   }
   //
   //
   // if (action.type === GET_JOBS_BEGIN) {
   //    return { ...state, isLoading: true, showAlert: false };
   // }
   // if (action.type === GET_JOBS_SUCCESS) {
   //    return {
   //       ...state,
   //       isLoading: false,
   //       jobs: action.payload.jobs,
   //       totalJobs: action.payload.totalJobs,
   //       numOfPages: action.payload.numOfPages,
   //    };
   // }
   //
   // if (action.type === SET_EDIT_JOB) {
   //    const job = state.jobs.find(job => job._id === action.payload.id);
   //    console.log(job);
   //    const { _id, position, company, jobLocation, jobType, status } = job;
   //    return {
   //       ...state,
   //       isEditing: true,
   //       editJobId: _id,
   //       position,
   //       company,
   //       jobLocation,
   //       jobType,
   //       status,
   //    };
   // }

   // if (action.type === DELETE_JOB_BEGIN) {
   //    return { ...state, isLoading: true };
   // }
   //
   //

   // if (action.type === EDIT_JOB_BEGIN) {
   //    return { ...state, isLoading: true };
   // }
   // if (action.type === EDIT_JOB_SUCCESS) {
   //    return {
   //       ...state,
   //       isLoading: false,
   //       showAlert: true,
   //       alertType: 'success',
   //       alertText: 'Job Updated!',
   //    };
   // }
   // if (action.type === EDIT_JOB_ERROR) {
   //    return {
   //       ...state,
   //       isLoading: false,
   //       showAlert: true,
   //       alertType: 'danger',
   //       alertText: action.payload.msg,
   //    };
   // }
   //
   //
   // if (action.type === SHOW_STATS_BEGIN) {
   //    return { ...state, isLoading: true, showAlert: false };
   // }
   // if (action.type === SHOW_STATS_SUCCESS) {
   //    return {
   //       ...state,
   //       isLoading: false,
   //       stats: action.payload.stats,
   //       monthlyApplications: action.payload.monthlyApplications,
   //    };
   // }
   //
   // if (action.type === CLEAR_FILTERS) {
   //    return {
   //       ...state,
   //       search: '',
   //       searchStatus: 'all',
   //       searchType: 'all',
   //       sort: 'latest',
   //    };
   // }

   // if (action.type === CHANGE_PAGE) {
   //    return { ...state, page: action.payload.page };
   // }

   throw new Error(`no such action :${action.type}`);
};

export default reducer;
