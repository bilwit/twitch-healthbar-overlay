
import { 
  Alert,
  Box,
  Button,
  Checkbox,
  Code,
  Group,
  List,
  Modal,
  Space,
  TextInput,
} from '@mantine/core';
import { Settings as Interface_Settings } from './useGetSettings';
import { useForm } from '@mantine/form';
import classes from '../../css/Nav.module.css';
import { BiInfoCircle } from 'react-icons/bi';
import { useState } from 'react';

interface Props {
  settings?: Interface_Settings
  isOpened: boolean,
  close: () => void,
}

function Settings(props: Props) {
  const RegistrationForm = useForm({
    initialValues: {
      listener_client_id: props?.settings?.listener_client_id || '',
      listener_secret: props?.settings?.listener_secret || '',
      listener_user_name: props?.settings?.listener_user_name || '',
      channel_name: props?.settings?.channel_name || '',
    },

    validate: {
      listener_client_id: (value) => value ? null : 'Required',
      listener_secret: (value) => value ? null : 'Required',
      listener_user_name: (value) => value ? null : 'Required',
      channel_name: (value) => value ? null : 'Required',
    },
  });

  const SubmitForm = useForm({
    initialValues: {
      listener_auth_code: props?.settings?.listener_auth_code || '',
      is_connected: props?.settings?.is_connected || false,
    },

    validate: {
      listener_auth_code: (value) => value ? null : 'Required',
      is_connected: (value) => value ? null : 'Required',
    },
  });

  const [settings, setSettings] = useState<Interface_Settings>({
    listener_auth_code: props?.settings?.listener_auth_code || '',
    listener_client_id: props?.settings?.listener_client_id || '',
    listener_secret: props?.settings?.listener_secret || '',
    listener_user_name: props?.settings?.listener_user_name || '',
    channel_name: props?.settings?.channel_name || '',
    is_connected: props?.settings?.is_connected || false,
  })
  const [isGeneratedAuthCodeSubmitted, setIsGeneratedAuthCodeSubmitted] = useState(false);
  
  return (
    <Modal 
      opened={props.isOpened} 
      onClose={props.close} 
      title="Settings"
      size="xl"
    >

      {!props.settings && (
        <Alert 
          className={classes['margin-bottom-1']}
          variant="light" 
          color="indigo" 
          title="Register Your Application" 
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={1.5} 
            />
          }
        >
          <div style={{ display: 'flex' }}>
            Log into the
            <Space w="xs" />
            <a href="https://dev.twitch.tv/console/apps/" target="_blank">Twitch Developer Console</a>
            <Space w="xs" />
            and
            <Space w="xs" />
            <b>Register Your Application</b>. Use the following values:
          </div>
          <Space h="xs" />
          <List withPadding>
            <List.Item>Name: Health Bar Overlay</List.Item>
            <List.Item>OAuth Redirect URLs: http://localhost</List.Item>
            <List.Item>Category: Chat Bot</List.Item>
          </List>
          <Space h="xs" />
          <div style={{ display: 'flex' }}>
            After choosing to
            <Space w="xs" />
            <b>Create</b>, 
            click
            <Space w="xs" />
            <b>Manage</b>
            <Space w="xs" />
            and create a
            <Space w="xs" />
            <b>New Secret</b>.
          </div>
          <Space h="xs" />
          <div style={{ display: 'flex' }}>
            Copy the
            <Space w="xs" />
            <Code>Client ID</Code>
            <Space w="xs" />
            and
            <Space w="xs" />
            <Code>Secret</Code>
            <Space w="xs" />
            for use with this form.
          </div>
        </Alert>
      )}
      
      <Box 
        mx="auto" 
        className={classes['margin-bottom-2']}
      >
        <form onSubmit={RegistrationForm.onSubmit((values) => {
          setSettings({
            listener_auth_code: '',
            is_connected: false,
            ...values,
          });
          setIsGeneratedAuthCodeSubmitted(true);
          console.log('submit')
        })}>
          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Channel Name"
            placeholder="Your Twitch Username"
            {...RegistrationForm.getInputProps('channel_name')}
            value={settings?.channel_name || props?.settings?.channel_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Bot Name"
            placeholder="Health Bar Listener"
            {...RegistrationForm.getInputProps('listener_user_name')}
            value={settings?.listener_user_name || props?.settings?.listener_user_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Client ID"
            placeholder="Client ID generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_client_id')}
            value={settings?.listener_client_id || props?.settings?.listener_client_id}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Secret"
            placeholder="Secret generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_secret')}
            value={settings?.listener_secret || props?.settings?.listener_secret}
          />

          {!props?.settings?.listener_auth_code && (
            <Group justify="flex-end" mt="md">
              <Button type="submit">Generate Auth Link</Button>
            </Group>
          )}

        </form>
      </Box>

      {!props?.settings?.listener_auth_code && isGeneratedAuthCodeSubmitted && (
        <Alert 
          className={classes['margin-bottom-1']}
          variant="light" 
          color="indigo" 
          title="Authorize Your Application" 
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={1.5} 
            />
          }
        >
          <div>
            Click the generated link below and choose to authorize the app.
            <Space h="xs" />
            <a href={
                'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + 
                settings.listener_client_id + 
                '&redirect_uri=' + 
                'http://localhost' + 
                '&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=123'
              } 
              target="_blank"
            >
              {
                'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + 
                settings.listener_client_id + 
                '&redirect_uri=' + 
                'http://localhost' + 
                '&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=123'
              }
            </a>
            <Space h="xs" />
          </div>
          <div style={{ display: 'flex' }}>
            The Auth Code is the
            <Space w="xs" />
            <Code>code=</Code>
            <Space w="xs" />
            parameter
            <Space w="xs" />
            of the URL in your browser upon redirect after authorization.
          </div>
        </Alert>
      )}

      {(props?.settings?.listener_auth_code || settings.listener_auth_code || isGeneratedAuthCodeSubmitted) && (
        <Box mx="auto">
          <form onSubmit={SubmitForm.onSubmit((values) => console.log(values))}>
            <TextInput
              className={classes['margin-bottom-1']}
              required
              label="Auth Code"
              placeholder=""
              {...SubmitForm.getInputProps('listener_auth_code')}
              value={settings?.listener_auth_code || props?.settings?.listener_auth_code}
            />

            <Checkbox
              mt="md"
              label="Connect to Twitch"
              {...SubmitForm.getInputProps('is_connected', { type: 'checkbox' })}
              checked={settings?.is_connected || props?.settings?.is_connected}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      )}

    </Modal>
  );
}

export default Settings;
