
import { 
  Affix,
  Alert,
  Button,
  LoadingOverlay,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import MonsterCard from './MonsterCard';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { GiMonsterGrasp } from 'react-icons/gi';
import { theme } from '../../../theme';
import ItemModal from './ItemModal';
import { useDisclosure } from '@mantine/hooks';
import useGetData from '../useGetData';

function Monsters() {
  const { 
    isLoading, 
    data: monsters, 
    setData: setMonsters, 
    error,
  } = useGetData('monsters/base/all');
  const [isOpened, { open, close }] = useDisclosure(false);

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

      <Stack>
        {!isLoading ? monsters && monsters.length > 0 ? monsters.map((monster) => (
          <MonsterCard key={monster.id}
            item={monster}
            setMonsters={setMonsters}
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
      </Stack>

      <Affix 
        position={{ bottom: 20, right: 20 }} 
        style={{ zIndex: 190 }}
      >
        <Button
          color={theme.colors.indigo[5]}
          leftSection={
            <GiMonsterGrasp 
              size="1rem" 
              stroke={1.5} 
            />
          }
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
        >
          Create
        </Button>

        <ItemModal 
          isOpened={isOpened}
          close={close}
          setMonsters={setMonsters}
        />
      </Affix>
    </>
  );
}

export default Monsters;
