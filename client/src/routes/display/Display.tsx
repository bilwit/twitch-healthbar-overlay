
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
      {monsters && monsters.length === 1 && (
        <h2>{monsters[0].name}</h2>
      )}
    </div>
  );
}

export default Display;
