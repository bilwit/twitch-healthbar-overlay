
import { 
  Affix,
  Alert,
  Button,
  Card,
  Center,
  LoadingOverlay,
  Stack,
  Text,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import MonsterCard from './MonsterCard';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { GiMonsterGrasp } from 'react-icons/gi';
import { theme } from '../../../theme';
import ItemModal from './ItemModal';
import { useDisclosure } from '@mantine/hooks';
import useGetData, { Monster } from '../useGetData';
import { useEffect, useState } from 'react';

interface RelationDict {
  [key: number]: Monster[],
}

function Monsters() {
  const { 
    isLoading, 
    data: monsters, 
    setData: setMonsters, 
    error,
  } = useGetData('monsters/base/all');
  const [isOpened, { open, close }] = useDisclosure(false);

  const [list, setList] = useState<Monster[][]>([]);

  useEffect(() => {
    if (monsters && Array.isArray(monsters) && monsters.length > 0) {
      const dict: RelationDict = {};

      for (const monster of monsters) {
        if (monster?.relations_id) {
          if (monster?.relations_id in dict) {
            dict[monster?.relations_id].push(monster);
          } else {
            dict[monster?.relations_id] = [monster];
          }
        } else {
          dict[monster.id] = [monster];
        }
      }

      setList(Object.keys(dict).map((group_key) => dict[Number(group_key)]));
    }
  }, [monsters]);

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
        {!isLoading ? 
          list && list.length > 0 ? (
            <>
              {list.map((group, index) => (
                <Card 
                  key={index} 
                  padding={0} 
                  mb="md"
                  bg={'black'}
                >
                {group.map((item, index) => (
                  <div>
                    {index > 0 && (
                      <Center>
                        <Text
                          size="xs"
                          fw={900}
                        >
                          LINK
                        </Text>
                      </Center>
                    )}
                    <MonsterCard key={item.id}
                      item={item}
                      setMonsters={setMonsters}
                    />
                  </div>
                ))}
                </Card>
              ))}
            </>
          ) : (
            <>
              {monsters && monsters.length > 0 ? monsters.map((monster) => (
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
              )}
            </>
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
