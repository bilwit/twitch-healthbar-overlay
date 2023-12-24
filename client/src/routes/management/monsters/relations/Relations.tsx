
import { 
  Alert, Button, Center, Group, NativeSelect,
} from '@mantine/core';
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { MdGroupAdd } from 'react-icons/md';
import useGetData, { Monster } from '../../useGetData';
import { theme } from '../../../../theme';
import { useForm } from '@mantine/form';
import classes from '../../../../css/Nav.module.css';

interface Props {
  data?: Monster,
}

function Relations(props: Props) {
  const { 
    isLoading, 
    data: monsters, 
    setData: setMonsters, 
    error,
  } = useGetData('monsters/base/all');

  const CreateForm = useForm({
    initialValues: {
      ref_id: props?.data?.id || '',
      relations: [],
    },

    validate: {
      ref_id: (value) => value ? null : 'Required',
      relations: (value) => value.length > 0 ? null : 'Required',
    },
  });

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
          data={props.data?.id ? monsters.filter((item) => props.data?.id && item.id !== props.data.id) : ['None']}
          {...CreateForm.getInputProps('relations')}
        />
      </Group>

      <Center>
        <Button 
          color={theme.colors.indigo[5]}
          variant="gradient"
          gradient={{ from: theme.colors.indigo[9], to: 'red', deg: 90 }}
          justify='end'
          radius="md"
          ml="xl"
          onClick={(e) => {
            e.preventDefault();
            open();
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
    </>
  );
}

export default Relations;
