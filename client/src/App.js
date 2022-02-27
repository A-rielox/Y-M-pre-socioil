import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Landing, Register, Error, ProtectedRoute } from './pages';
import {
   AddRecipe,
   AllRecipes,
   Profile,
   SharedLayout,
   Stats,
} from './pages/dashboard';
/* 

video 88

*/
function App() {
   return (
      <BrowserRouter>
         <nav>
            <Link to="/">Dashboard </Link>
            <Link to="/register">Register </Link>
            <Link to="/landing">Home</Link>
         </nav>

         <Routes>
            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <SharedLayout />
                  </ProtectedRoute>
               }
            >
               <Route index element={<Stats />} />
               <Route path="all-recipes" element={<AllRecipes />} />
               <Route path="add-recipe" element={<AddRecipe />} />
               <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/register" element={<Register />} />

            <Route path="/landing" element={<Landing />} />

            <Route path="*" element={<Error />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
