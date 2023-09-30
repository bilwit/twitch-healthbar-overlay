
// import { 
//   Alert,
//   LoadingOverlay,
//   SimpleGrid,
// } from '@mantine/core';
// import useGetMonsters from './useGetMonsters';
// import { BiError, BiInfoCircle } from 'react-icons/bi';
// import classes from '../../../css/Nav.module.css';
// import Item from './Item';

import useGetMonsters from "../management/monsters/useGetMonsters";

function Display() {
  const { monsters } = useGetMonsters('1');

  return (
    <div>
      {monsters && monsters.length > 0 && monsters.map((item) => (
        <h1>{item.name}</h1>
      ))}
    </div>
  );
}

export default Display;
