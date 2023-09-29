
import { 
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  TextInput,
} from '@mantine/core';
import { Settings as Interface_Settings } from './useGetSettings';
import { useForm } from '@mantine/form';
import classes from '../../css/Nav.module.css';

interface Props {
  settings?: Interface_Settings
  isOpened: boolean,
  close: () => void,
}

function Settings(props: Props) {
  const form = useForm({
    initialValues: {
      listener_auth_code: '',
      listener_client_id: '',
      listener_secret: '',
      listener_user_name: '',
      channel_name: '',
      is_connected: false,
    },

    validate: {
      listener_auth_code: (value) => value ? null : 'Required',
      listener_client_id: (value) => value ? null : 'Required',
      listener_secret: (value) => value ? null : 'Required',
      listener_user_name: (value) => value ? null : 'Required',
      channel_name: (value) => value ? null : 'Required',
    },
  });
  
  return (
    <Modal 
      opened={props.isOpened} 
      onClose={props.close} 
      title="Settings"
      size="xl"
    >
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          className={classes['margin-bottom-1']}
          withAsterisk
          label="Auth Code"
          placeholder=""
          {...form.getInputProps('listener_auth_code')}
        />

        <TextInput
          className={classes['margin-bottom-1']}
          withAsterisk
          label="Client ID"
          placeholder=""
          {...form.getInputProps('listener_client_id')}
        />

        <TextInput
          className={classes['margin-bottom-1']}
          withAsterisk
          label="Secret"
          placeholder=""
          {...form.getInputProps('listener_secret')}
        />

        <TextInput
          className={classes['margin-bottom-1']}
          withAsterisk
          label="Bot Name"
          placeholder=""
          {...form.getInputProps('listener_user_name')}
        />

        <TextInput
          className={classes['margin-bottom-1']}
          withAsterisk
          label="Channel Name"
          placeholder=""
          {...form.getInputProps('channel_name')}
        />

        <Checkbox
          mt="md"
          label="Connect to Twitch"
          {...form.getInputProps('is_connected', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
    </Modal>
  );
}

export default Settings;
