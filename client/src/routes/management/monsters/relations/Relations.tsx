
import { 
  Alert, Button, Center, Group, LoadingOverlay, NativeSelect, Stack,
} from '@mantine/core';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { MdGroupAdd } from 'react-icons/md';
import useGetData, { Monster } from '../../useGetData';
import { theme } from '../../../../theme';
import classes from '../../../../css/Nav.module.css';
import { useEffect, useState } from 'react';
import Item from './Item';

interface Props {
  data?: Monster,
  editRelations: (ref_model: Monster) => void
}

function Relations(props: Props) {
  const { 
    isLoading, 
    data: monsters, 
    error,
    setError,
  } = useGetData('monsters/base/all');

  const { 
    isLoading: isLoadingRelations,
    data: relations, 
    setData: setRelations,
  } = useGetData('monsters/relations/' + props?.data?.relations_id);

  const [selected, setSelected] = useState('None');
  const [selectList, setSelectList] = useState<string[]>([]);

  // set available monster relation list
  useEffect(() => {
    if (!isLoading && !isLoadingRelations && monsters && Array.isArray(monsters) && monsters.length > 0) {
      const dict: { [key: string]: number } = {};
      const list: string[] = [];

      if (relations.length > 0) {
        for (const relation of relations) {
          dict[relation.name] = relation.id;
        }
      }
      
      for (const monster of monsters) {
        if (monster.id !== props.data?.id && !(monster.name in dict)) {
          list.push(monster.name);
        }
      }

      setSelectList(list);
    }
  }, [isLoading, isLoadingRelations, monsters, relations]);

  const submit = async () => {
    let ref_id = 0;
    for (const monster of monsters) {
      if (monster.name === selected) {
        ref_id = monster.id;
      }
    }

    const result = await fetch(
      '/api/monsters/relations/' + props.data?.id + '?ref=' + ref_id,
      { 
        method: 'PUT',
      },
    );

    if (result) {
      const responseJson = await result.json();
      if (responseJson.success) {
        props.editRelations(responseJson.data[0]);
        setRelations((prev) => ([...prev, ...responseJson.data]));
        setSelectList((prev) => prev.filter((item) => ![...prev, ...responseJson.data].map((item) => item.name).includes(item)));
      } else {
        if (responseJson?.msg) {
          throw responseJson.msg;
        }
        throw '';
      }
    }
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

      <Alert 
        variant="light" 
        color="indigo" 
        title="" 
        mb={"md"}
        icon={
          <BiInfoCircle 
            size="1rem" 
            stroke={1.5} 
          />
        }
      >
        <div style={{ display: 'flex' }}>
          Link monsters to form health races. All linked health bars are paused when one completes.
        </div>
      </Alert>

      <Group>
        <NativeSelect 
          label="Select Available Monster" 
          data={props.data?.id ? ['None', ...selectList] : ['None']}
          onChange={(e) => setSelected(e.currentTarget.value)}
        />
      </Group>

      <Center>
        <Button 
          disabled={selected === 'None'}
          color={theme.colors.indigo[5]}
          variant="gradient"
          gradient={{ from: theme.colors.indigo[9], to: 'red', deg: 90 }}
          justify='end'
          radius="md"
          ml="xl"
          onClick={(e) => {
            e.preventDefault();
            submit();
          }}
          leftSection={
            <MdGroupAdd  
              size="1rem" 
              stroke={1.5} 
            />
          }
        >
          Add Relation
        </Button>
      </Center>
      
      <Stack mt="xl">
      {isLoading ? (
        <LoadingOverlay visible={isLoading} zIndex={2} overlayProps={{ radius: "sm", blur: 2 }} />
      ) : (
        <>
          {relations
            .map((item) => item.id === props?.data?.id ? null : (
              <Item
                key={item.id + ' _' + props?.data?.id}
                data={item}
                setData={setRelations}
                setError={setError}
                setSelectList={setSelectList}
                editRelations={props.editRelations}
              />
            ))
          }
        </>
      )}
      </Stack>
    </>
  );
}

export default Relations;
