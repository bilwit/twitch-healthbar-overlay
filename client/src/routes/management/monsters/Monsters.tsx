
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

const groupsOfMonsters = (monsters: Monster[], edit_model: Monster | null = null) => {
  const dict: RelationDict = {};

  for (const monster of monsters) {
    let mon = monster;
    if (edit_model && monster.id === edit_model?.id) {
      mon = edit_model;
    }
    if (mon?.relations_id) {
      if (mon?.relations_id in dict) {
        dict[mon?.relations_id].push(mon);
      } else {
        dict[mon?.relations_id] = [mon];
      }
    } else {
      dict[mon.id] = [mon];
    }
  }

  return dict;
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
      const dict = groupsOfMonsters(monsters);
      setList(Object.keys(dict).map((group_key) => dict[Number(group_key)]));
    }
  }, [monsters]);

  const removeLink = (ref_model: Monster) => {
    const dict = groupsOfMonsters(monsters, ref_model);
    setList(Object.keys(dict).map((group_key) => dict[Number(group_key)]));
  }

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
                  key={'card_' + index} 
                  padding={0} 
                  bg={'black'}
                >
                {group.map((item, index) => (
                  <div key={'group_' + item.id}>
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
                    <MonsterCard
                      item={item}
                      setMonsters={setMonsters}
                      removeLink={removeLink}
                    />
                  </div>
                ))}
                </Card>
              ))}
            </>
          ) : (
            <>
              {monsters && monsters.length > 0 ? monsters.map((monster) => (
                <MonsterCard key={'monstercard_' + monster.id}
                  item={monster}
                  setMonsters={setMonsters}
                  removeLink={removeLink}
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
          removeLink={removeLink}
        />
      </Affix>
    </>
  );
}

export default Monsters;
