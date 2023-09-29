
import { 
  SimpleGrid,
} from '@mantine/core';
import useGetMonsters from './useGetMonsters';

function Monsters() {
  const { monsters } = useGetMonsters();
  
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 5 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
    {monsters && monsters.length > 0 && monsters.map((monster) => (
      <div key={monster.id}>
        {monster.name}
      </div>
    ))}
    </SimpleGrid>
  );
}

export default Monsters;
