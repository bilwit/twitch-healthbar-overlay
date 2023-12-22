
import { 
  Alert,
  Button,
  Card,
  Image,
  FileInput,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  Space,
  TagsInput,
  TextInput,
  Text,
  Overlay,
  NativeSelect,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import { GiMonsterGrasp } from 'react-icons/gi';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { theme } from '../../../../theme';
import { BiInfoCircle } from 'react-icons/bi';
import { Monster } from '../../useGetData';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import Alerts from '../../Alerts';
import CopyURL from './CopyURL';

interface Props {
  isOpened: boolean,
  close: () => void,
  data?: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
  setModalName: React.Dispatch<React.SetStateAction<string>>,
}

interface FormDataInterface {
  name: string;
  published: string;
  hp_multiplier: number;
  bar_theme: string;
  avatarFile: File | null;
  trigger_words: string[];
}

function Properties(props: Props) {
  const CreateForm = useForm({
    initialValues: {
      name: props?.data?.name || '',
      published: props?.data?.published === true ? 'true' : 'false',
      hp_multiplier: props?.data?.hp_multiplier || 5,
      avatarFile: null,
      trigger_words: props?.data?.trigger_words ? props?.data?.trigger_words.split(',') : [],
      bar_theme: props?.data?.bar_theme || 'basic',
    },

    validate: {
      name: (value) => value ? null : 'Required',
      published: (value) => {
        if (value === 'true' || value === 'false') {
          return null;
        }
        return 'Required';
      },
      hp_multiplier: (value) => value ? null : 'Required',
      bar_theme: (value) => value ? null : 'Required',
      avatarFile: () => null,
      trigger_words: (value) => {
        if (value.length > 0) {
          return null;
        }
        return 'Required';
      },
    },
  });
  const [info, setInfo] = useState('');
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(props?.data?.id && (props?.data?.id !== null) ? true : false);
  const [isEditSuccess, setIsEditSuccess] = useState('');
  const [obsOverlayURLHealth, setObsOverlayURLHealth] = useState(props?.data?.id ? window.location.origin + '/display/bars/' + props.data.id : '');
  const [obsOverlayURLAvatar, setObsOverlayURLAvatar] = useState(props?.data?.id ? window.location.origin + '/display/avatars/' + props.data.id : '');
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);

  return (
    <>
      <Alerts
        error={error}
        warning={warning}
        success={isEditSuccess}
        info={info}
      />

      <form onSubmit={CreateForm.onSubmit(async (values: FormDataInterface) => {
        // check if any changes have been made
        if (!isAvatarChanged && props?.data?.id && 
          (props.data.name === values.name) &&
          (props.data.published.toString() === values.published) &&
          (props.data.hp_multiplier === values.hp_multiplier) &&
          (props.data.bar_theme === values.bar_theme) && 
          (props.data.trigger_words?.trim() === values.trigger_words.join(',').trim())
        ) {
          setWarning('No changes made to the original content');
        } else {
          const submitFormData = new FormData();
          for (const property of (Object.keys(values))) {
            submitFormData.set(property, JSON.stringify(values[property as keyof FormDataInterface]));
          }
          if (avatarFile) {
            submitFormData.set('avatarFile', avatarFile);
          }
          submitFormData.set('published', values.published === 'true' ? 'true' : 'false');
          submitFormData.set('isAvatarChanged', JSON.stringify(isAvatarChanged));
          try {
            const result = await fetch(
              props?.data?.id ? '/api/monsters/' + props.data.id : '/api/monsters',
              { 
                method: props?.data?.id ? 'PUT' : 'POST',
                body: submitFormData,
              },
            );
            if (result) {
              const responseJson = await result.json();
              if (responseJson.success) {
                setObsOverlayURLHealth(window.location.origin + '/display/bars/' + responseJson.data[0].id);
                setObsOverlayURLAvatar(window.location.origin + '/display/avatars/' + responseJson.data[0].id);

                // update main page list in parent component
                if (!props?.data?.id) {
                  // new monster
                  setIsSubmitted(true);
                  props.setMonsters((prev) => ([
                    ...prev,
                    responseJson.data[0],
                  ]));
                  props.setModalName(responseJson.data[0].name);
                  setInfo('Monster created!')
                } else {
                  // edited monster
                  props.setMonsters((prev) => prev.map((item) => item.id === responseJson.data[0].id ? responseJson.data[0] : item).sort((a, b) => a.updated_at < b.updated_at ? -1 : 1));
                  setIsEditSuccess('Monster values updated')
                }
                
                setWarning('');
                return setError('');
              } else {
                if (responseJson?.msg) {
                  throw responseJson.msg;
                }
                throw '';
              }
            }
          } catch (err) {
            return setError(err && typeof err === 'string' ? err : 'Could not submit settings');
          }
        }
        })
      }>
        <Grid>
          <Grid.Col span={5}>
            <Text size="sm">
            Avatar Preview 
            </Text>
            <Card shadow="sm" padding="lg" radius="sm" withBorder>
              <Card.Section>
                {avatar ? (
                  <Image
                    src={avatar}
                    height={200}
                    alt="Image"
                  />
                ) : props?.data?.avatar_url ? (
                  <Image
                    src={window.location.origin + '/api/avatar/' + props?.data?.avatar_url}
                    height={200}
                    alt="Image"
                  />
                ) : (
                  <Group justify='center'>
                    <BsFillPersonFill size={210} />
                    <Overlay color="#000" backgroundOpacity={0.35} blur={15} />
                  </Group>
                )}
              </Card.Section>
            </Card>
            <FileInput 
              accept="image/png,image/jpeg,image/gif,image/svg" 
              placeholder="Upload File" 
              onChange={(data) => {
                if (data) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event?.target) {
                      setAvatar(event?.target?.result);
                    }
                  };
                  reader.readAsDataURL(data);
                  setAvatarFile(data);
                  setIsAvatarChanged(true);
                }
              }}
            />
          </Grid.Col>

          <Grid.Col span={7}>
            <TextInput
              className={classes['margin-bottom-1']}
              required
              label="Name"
              placeholder="Mr. Snake"
              {...CreateForm.getInputProps('name')}
            />

            <Grid grow>
              <Grid.Col span={5}>
                <NumberInput
                  className={classes['margin-bottom-1']}
                  required
                  label="HP Per-Chat User"
                  {...CreateForm.getInputProps('hp_multiplier')}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <NativeSelect 
                  label="Health Bar Theme" 
                  data={['Basic']}
                  {...CreateForm.getInputProps('bar_theme')}
                />
              </Grid.Col>
            </Grid>

            <TagsInput
              withAsterisk
              className={classes['margin-bottom-1']}
              label="Text Triggers" 
              placeholder="Press ENTER per-tag" 
              {...CreateForm.getInputProps('trigger_words')}
            />

            <Group 
              style={{ display: 'grid' }}
              justify="flex-center" 
              mt="md"
            >
              <SegmentedControl
                {...CreateForm.getInputProps('published')}
                color={theme.colors.indigo[9]}
                data={[
                  { label: 'Enabled', value: 'true' },
                  { label: 'Disabled', value: 'false' },
                ]}
              />
            </Group>
          </Grid.Col>

        </Grid>

        {isSubmitted && (
          <>
            <Alert 
              mt="xl"
              variant="light" 
              color="indigo" 
              title="Display in OBS" 
              icon={
                <BiInfoCircle 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              <div style={{ display: 'flex' }}>
                Copy the URL below to add as a
                <Space w="xs" />
                <b>browser source</b>
                <Space w="xs" />
                in OBS.
              </div>
              <div style={{ display: 'flex' }}>
                When enabled, the Twitch chat bot will actively count trigger strings to affect its health.
              </div>
            </Alert>

            <CopyURL
              url={obsOverlayURLHealth}
              details={{
                label: "Health Bar",
                description: "OBS Overlay URL",
              }}
            />

            <CopyURL
              url={obsOverlayURLAvatar}
              details={{
                label: "Avatar",
                description: "OBS Overlay URL",
              }}
            />
          </>
        )}

        
        {!isSubmitted && (
          <Group justify="center" mt="xl">
            <Button 
              color={theme.colors.indigo[5]}
              variant="gradient"
              gradient={{ from: theme.colors.indigo[9], to: 'cyan', deg: 90 }}
              type="submit"
              leftSection={
                <GiMonsterGrasp 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              Create
            </Button>
          </Group>
        )}

        {props?.data?.id && (
          <Group justify="center" mt="xl">
            <Button 
              color={theme.colors.indigo[5]}
              variant="gradient"
              gradient={{ from: theme.colors.indigo[9], to: 'cyan', deg: 90 }}
              type="submit"
              disabled={isDeleteWarning}
              leftSection={
                <GiMonsterGrasp 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              Edit
            </Button>

            <Button 
              color={theme.colors.indigo[5]}
              variant="gradient"
              gradient={{ from: theme.colors.indigo[9], to: 'red', deg: 90 }}
              disabled={isDeleteWarning}
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteWarning(true);
              }}
              leftSection={
                <AiFillDelete 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              {isDeleteWarning ? 'Are you sure?' : 'Delete'}
            </Button>

            {isDeleteWarning && (
              <Button 
                variant="gradient"
                gradient={{ from: theme.colors.yellow[9], to: 'red', deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const result = await fetch(
                      '/api/monsters/' + props?.data?.id,
                      { 
                        method: 'DELETE',
                      },
                    );
                    if (result) {
                      const responseJson = await result.json();
                      if (responseJson.success && responseJson?.data?.[0]?.id) {
                        props.setMonsters((prev) => prev.filter((item) => item.id !== responseJson.data[0].id));
                        setWarning('');
                        setIsDeleteWarning(false);
                        return setError('');
                      } else {
                        if (responseJson?.msg) {
                          throw responseJson.msg;
                        }
                        throw '';
                      }
                    }
                  } catch (err) {
                    return setError(err && typeof err === 'string' ? err : 'Could not submit settings');
                  }
                }}
              >
                Delete
              </Button>
            )}
          </Group>
        )}
      </form>
    </>
  );
}

export default Properties;
