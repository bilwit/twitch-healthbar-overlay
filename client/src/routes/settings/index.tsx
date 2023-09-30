
import { 
  Alert,
  Box,
  Button,
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
import { BiError, BiInfoCircle } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { theme } from '../../theme';
import { useNavigate } from 'react-router-dom';

interface Props {
  settings?: Interface_Settings
  isOpened: boolean,
  close: () => void,
}

function Settings(props: Props) {
  const navigate = useNavigate();
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
    },

    validate: {
      listener_auth_code: (value) => value ? null : 'Required',
    },
  });

  const [settings, setSettings] = useState<Interface_Settings>({
    listener_auth_code: props?.settings?.listener_auth_code || '',
    listener_client_id: props?.settings?.listener_client_id || '',
    listener_secret: props?.settings?.listener_secret || '',
    listener_user_name: props?.settings?.listener_user_name || '',
    channel_name: props?.settings?.channel_name || '',
  });
  const [isGeneratedAuthCodeSubmitted, setIsGeneratedAuthCodeSubmitted] = useState(false);
  const [isSubmitted, SetIsSubmitted] = useState(props?.settings?.is_connected ? true : false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    if (props.settings) {
      setSettings({
        listener_auth_code: props?.settings?.listener_auth_code,
        listener_client_id: props?.settings?.listener_client_id,
        listener_secret: props?.settings?.listener_secret,
        listener_user_name: props?.settings?.listener_user_name,
        channel_name: props?.settings?.channel_name,
      });

      if (props?.settings?.is_connected) {
        SetIsSubmitted(true);
      }
    } else {
      setSettings({
        listener_auth_code: '',
        listener_client_id: '',
        listener_secret: '',
        listener_user_name: '',
        channel_name: '',
      });
      SetIsSubmitted(false);
    }
  }, [props.settings]);

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
        })}>
          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Channel Name"
            placeholder="Your Twitch Username"
            {...RegistrationForm.getInputProps('channel_name')}
            value={settings?.channel_name || props?.settings?.channel_name}
            defaultValue={settings?.channel_name || props?.settings?.channel_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Bot Name"
            placeholder="Health Bar Listener"
            {...RegistrationForm.getInputProps('listener_user_name')}
            value={settings?.listener_user_name || props?.settings?.listener_user_name}
            defaultValue={settings?.listener_user_name || props?.settings?.listener_user_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Client ID"
            placeholder="Client ID generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_client_id')}
            value={settings?.listener_client_id || props?.settings?.listener_client_id}
            defaultValue={settings?.listener_client_id || props?.settings?.listener_client_id}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Secret"
            placeholder="Secret generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_secret')}
            value={settings?.listener_secret || props?.settings?.listener_secret}
            defaultValue={settings?.listener_secret || props?.settings?.listener_secret}
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              SubmitForm.onSubmit(async (values) => {
                setSettings((prev) => ({
                  ...prev,
                  ...values,
                }))
                try {
                  const result = await fetch(
                    '/api/settings',
                    { 
                      method: 'PUT',
                      body: JSON.stringify({
                        ...settings,
                        ...values,
                      })
                    },
                  );
                  if (result) {
                    const responseJson = await result.json();
                    if (responseJson.success) {
                      setError('');
                      return SetIsSubmitted(true);
                    } 
                    throw true;
                  }
                } catch (e) {
                  setError('Could not submit settings');
                }
              })
            }}
          >
            <TextInput
              className={classes['margin-bottom-1']}
              required
              label="Auth Code"
              placeholder="Auth Code generated by the authorization redirect URL"
              {...SubmitForm.getInputProps('listener_auth_code')}
              value={settings?.listener_auth_code || props?.settings?.listener_auth_code}
              defaultValue={settings?.listener_auth_code || props?.settings?.listener_auth_code}
            />

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

            {!isSubmitted && (
              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            )}
          </form>
        </Box>
      )}

      {isSubmitted && (
        <>
          {warning && (
            <Alert 
              className={classes['margin-bottom-1']}
              variant="light" 
              color="yellow" 
              title="Warning" 
              icon={
                <BiError 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              {warning}
            </Alert>
          )}
          <Group justify="flex-end" mt="md">
            <Button 
              disabled={warning ? true : false}
              color={'red'}
              onClick={(e) => {
                e.preventDefault();
                setWarning('This will disable any active connections between the bot and Twitch chat. In order to completely remove this information, you must unregister the application in the Twitch Developer Console.');
              }}
            >
              {warning ? 'Are you sure?' : 'Disconnect'}
            </Button>
            {warning && (
              <Button 
                color={theme.colors.yellow[9]}
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const result = await fetch(
                      '/api/settings',
                      { 
                        method: 'DELETE',
                      },
                    );
                    if (result) {
                      const responseJson = await result.json();
                      if (responseJson.success) {
                        setSettings({
                          listener_auth_code: '',
                          listener_client_id: '',
                          listener_secret: '',
                          listener_user_name: '',
                          channel_name: '',
                        });
                        setIsGeneratedAuthCodeSubmitted(false);
                        SetIsSubmitted(false);
                        setError('');
                        setWarning('');
                        props.close();
                        navigate(-1);
                      } 
                    }
                  } catch (_e) {
                    setError('Could not submit settings');
                  }
                }}
              >
                Disconnect
              </Button>
            )}
          </Group>
        </>
      )}

    </Modal>
  );
}

export default Settings;
