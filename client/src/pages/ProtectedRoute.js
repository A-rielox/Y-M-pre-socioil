import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const ProtectedRoute = ({ children }) => {
   const { user } = useAppContext();

   if (!user) {
      // SI NO está logeado las mando a landing
      return <Navigate to="/landing" />;
   }
   // solo SI HAY "user" devuelve "children", sino, las mando al landing
   return children;
};

export default ProtectedRoute;
