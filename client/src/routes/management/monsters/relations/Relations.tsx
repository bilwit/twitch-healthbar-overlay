
import { 
  Alert, Button, Center, Group, LoadingOverlay, NativeSelect, Stack,
} from '@mantine/core';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { MdGroupAdd } from 'react-icons/md';
import useGetData, { Monster } from '../../useGetData';
import { theme } from '../../../../theme';
import classes from '../../../../css/Nav.module.css';
import { useEffect, useState } from 'react';

interface Props {
  data?: Monster,
}

function Relations(props: Props) {
  const { 
    isLoading, 
    data: monsters, 
    error,
  } = useGetData('monsters/base/all');

  const [relations, setRelations] = useState<Monster[]>([]);
  const [selected, setSelected] = useState('None');
  const [selectList, setSelectList] = useState(monsters.filter((item) => props.data?.id && item.id !== props.data.id).map((item) => item.name));

  useEffect(() => {
    if (!isLoading && monsters && Array.isArray(monsters) && monsters.length > 0) {
      setSelectList(monsters.filter((item) => props.data?.id && item.id !== props.data.id).map((item) => item.name));
    }
  }, [isLoading, monsters]);

  console.log(relations)

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
        setRelations((prev) => ([...prev, ...responseJson.data]));
        setSelectList((prev) => prev.filter((item) => item.id !== ref_id));
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
      
      <Stack>
      {isLoading ? (
        <LoadingOverlay visible={isLoading} zIndex={2} overlayProps={{ radius: "sm", blur: 2 }} />
      ) : (
        <>
          {relations.map((item) => item)}
        </>
      )}
      </Stack>
    </>
  );
}

export default Relations;
