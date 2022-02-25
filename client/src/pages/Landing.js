import { Logo } from '../components';
import { Link } from 'react-router-dom';

import fondo from '../assets/images/fondo2.svg';
import styled from 'styled-components';

const Landing = () => {
   return (
      <Wrapper>
         <nav>
            <Logo />
         </nav>

         <div className="container page">
            <div className="info">
               <h1>
                  soci<span>oil</span> media
               </h1>
               <p>
                  Tus recetas, artículos y el estilo de vida que estabas
                  buscando.
               </p>

               <Link to="/register" className="btn btn-hero">
                  Login / Registro
               </Link>
            </div>

            <img src={fondo} alt="job hunting" className="img main-img" />
         </div>
      </Wrapper>
   );
};

export default Landing;

const Wrapper = styled.main`
   nav {
      width: var(--fluid-width);
      max-width: var(--max-width);
      margin: 0 auto;
      height: var(--nav-height);
      display: flex;
      align-items: center;
   }
   .page {
      min-height: calc(100vh - var(--nav-height));
      display: grid;
      align-items: center;
      margin-top: -3rem;
   }
   h1 {
      font-weight: 700;
      span {
         color: var(--primary-500);
      }
   }
   p {
      color: var(--grey-600);
   }
   .main-img {
      display: none;
   }
   .logo {
      max-width: 170px;
      position: absolute;
      top: 20px;
   }
   @media (min-width: 992px) {
      .page {
         grid-template-columns: 1fr 1fr;
         column-gap: 3rem;
      }
      .main-img {
         display: block;
      }
   }
`;

/* 
import { Link } from 'react-router-dom';
import { Logo } from '../components';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';

const Landing = () => {
   return (
      <Wrapper>
         <nav>
            <Logo />
         </nav>

         <div className="container page">
            <div className="info">
               <h1>
                  job <span>tracking</span> app
               </h1>
               <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Voluptas dolor fugit earum, laudantium numquam quisquam
                  molestias, quidem natus quibusdam dolores molestiae maiores
                  vitae amet veritatis magnam assumenda sit, eaque fugiat?
               </p>

               <Link to="/register" className="btn btn-hero">
                  Login / Register
               </Link>
            </div>

            <img src={main} alt="job hunting" className="img main-img" />
         </div>
      </Wrapper>
   );
};

export default Landing;

*/
