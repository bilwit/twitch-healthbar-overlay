
import { 
  Affix,
  Alert,
  LoadingOverlay,
  SimpleGrid,
} from '@mantine/core';
import useGetMonsters from './useGetMonsters';
import classes from '../../../css/Nav.module.css';
import Item from './Item';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import Create from './Create';

function Monsters() {
  const { isLoading, monsters, error } = useGetMonsters();

  return (
    <>
      {error && (
        <Alert 
          className={classes['margin-bottom-1']}
          variant="light" 
          color="red" 
          title="Error" 
          icon={
            <BiError 
              size="1rem" 
              stroke={1.5} 
            />
          }
        >
          {error}
        </Alert>
      )}

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 5 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        {!isLoading ? monsters && monsters.length > 0 ? monsters.map((monster) => (
          <Item key={monster.id}
            item={monster}
          />
        )) : (
          <Alert 
            className={classes['margin-bottom-1']}
            variant="light" 
            color="indigo" 
            title="Note" 
            icon={
              <BiInfoCircle 
                size="1rem" 
                stroke={1.5} 
              />
            }
          >
            No monsters added yet
          </Alert>
        ) : (
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        )}
      </SimpleGrid>

      <Affix 
        position={{ bottom: 20, right: 20 }} 
        style={{ zIndex: 190 }}
      >
        <Create />
      </Affix>
    </>
  );
}

export default Monsters;
