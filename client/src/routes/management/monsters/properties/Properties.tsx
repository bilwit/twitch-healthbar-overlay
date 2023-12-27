
import { 
  Button,
  Card,
  Image,
  FileInput,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  TagsInput,
  TextInput,
  Text,
  Overlay,
  NativeSelect,
  Accordion,
  Alert,
} from '@mantine/core';
import classes from '../../../../css/Nav.module.css'
import { GiMonsterGrasp } from 'react-icons/gi';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { theme } from '../../../../theme';
import { Monster } from '../../useGetData';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import Alerts from '../../Alerts';
import { BiInfoCircle } from 'react-icons/bi';

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
  hp_style: string,
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
      hp_style: props?.data?.hp_style || 'Scaled',
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
      hp_style: (value) => value ? null  : 'Required',
      hp_multiplier: (value) => Number(value) >= 0 ? null : 'Required',
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
  
  const [infoHealthStyle, setInfoHealthStyle] = useState(false);
  const [info, setInfo] = useState<string | JSX.Element>();
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(props?.data?.id && (props?.data?.id !== null) ? true : false);
  const [isEditSuccess, setIsEditSuccess] = useState('');
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);

  return (
    <>
      {info ? (
        <Alerts
          error={error}
          warning={warning}
          success={isEditSuccess}
          info={info}
        />
      ) : (
          <>
            {InfoDefault}
          </>
      )}
      

      <form onSubmit={CreateForm.onSubmit(async (values: FormDataInterface) => {
        // check if any changes have been made
        if (!isAvatarChanged && props?.data?.id && 
          (props.data.name === values.name) &&
          (props.data.hp_style === values.hp_style) && 
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
              props?.data?.id ? '/api/monsters/base/' + props.data.id : '/api/monsters/base',
              { 
                method: props?.data?.id ? 'PUT' : 'POST',
                body: submitFormData,
              },
            );
            if (result) {
              const responseJson = await result.json();
              if (responseJson.success) {
                // update main page list in parent component
                if (!props?.data?.id) {
                  // new monster
                  setIsSubmitted(true);
                  props.setMonsters((prev) => ([
                    ...prev,
                    responseJson.data[0],
                  ]));
                  props.setModalName(responseJson.data[0].name);
                  setInfo('Monster created!');

                  setTimeout(() => props.close(), 1500);
                } else {
                  // edited monster
                  props.setMonsters((prev) => prev.map((item) => item.id === responseJson.data[0].id ? responseJson.data[0] : item).sort((a, b) => a.updated_at < b.updated_at ? -1 : 1));
                  setIsEditSuccess('Monster values updated');

                  setTimeout(() => props.close(), 1500);
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
                <NativeSelect 
                  label="Health Style" 
                  rightSection={(
                    <BiInfoCircle 
                      size="1rem" 
                      stroke={1.5} 
                    />
                  )}
                  required
                  data={['Fixed', 'Growing', 'Scaled']}
                  {...CreateForm.getInputProps('hp_style')}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <NumberInput
                  className={classes['margin-bottom-1']}
                  required
                  label={
                    CreateForm.values?.hp_style === 'Scaled' ? 'HP Per-Chat User' : 
                    CreateForm.values?.hp_style === 'Growing' ? 'Limit' :
                    'Limit'
                  }
                  {...CreateForm.getInputProps('hp_multiplier')}
                />
              </Grid.Col>
            </Grid>

            <NativeSelect 
              label="Health Bar Theme" 
              data={['Basic']}
              {...CreateForm.getInputProps('bar_theme')}
            />

            <TagsInput
              mt="md"
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
                      '/api/monsters/base/' + props?.data?.id,
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

const InfoDefault = (
  <Accordion mb="md" defaultValue="" variant="contained">
    <Accordion.Item value="healthStyles">
      <Alert 
        mb={0}
        p={0}
        className={classes['margin-bottom-1']}
        variant="light" 
        color="indigo"
      >
        <Accordion.Control>
          <Group>
            <BiInfoCircle 
              size="1rem" 
              stroke={1.5} 
            />
            <Text>
              Health Styles
            </Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <p style={{ marginTop: 0 }}><b>Fixed:</b> Maximum health is a defined number and starts at 100%.</p>
          <p style={{ marginTop: 0 }}><b>Growing:</b> Maximum health is a defined number and starts at 0%.</p>
          <p style={{ marginTop: 0 }}><b>Scaled:</b> Health scales dynamically with the number of users in chat. The <b>HP Per-Chat User</b> amount determines how many triggers per user is the maximum health.</p>
        </Accordion.Panel>
      </Alert>
    </Accordion.Item>
  </Accordion>
)

export default Properties;
