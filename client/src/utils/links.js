import { IoBarChartSharp } from 'react-icons/io5';
import { GiHealthPotion } from 'react-icons/gi';
import { GiPotionBall } from 'react-icons/gi';
import { ImProfile } from 'react-icons/im';

const links = [
   {
      id: 1,
      text: 'estadísticas',
      path: '/',
      icon: <IoBarChartSharp />,
   },
   {
      id: 2,
      text: 'todas las recetitas',
      path: 'all-recipes',
      icon: <GiHealthPotion />,
   },
   {
      id: 3,
      text: 'añadir recetita',
      path: 'add-recipe',
      icon: <GiPotionBall />,
   },
   {
      id: 4,
      text: 'perfil',
      path: 'profile',
      icon: <ImProfile />,
   },
];

export default links;
