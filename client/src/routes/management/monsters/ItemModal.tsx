
import { 
  Alert,
  Button,
  CopyButton,
  Grid,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Space,
  TagsInput,
  TextInput,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import { GiMonsterGrasp } from 'react-icons/gi';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { theme } from '../../../theme';
import { BiInfoCircle } from 'react-icons/bi';
import { Monster } from './useGetMonsters';
import Alerts from '../Alerts';

interface Props {
  isOpened: boolean,
  close: () => void,
  data?: Monster,
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
}

function ItemModal(props: Props) {
  const CreateForm = useForm({
    initialValues: {
      name: props?.data?.name || '',
      published: props?.data?.published === true ? 'true' : 'false',
      hp_multiplier: props?.data?.hp_multiplier || 5,
      trigger_words: props?.data?.trigger_words ? props?.data?.trigger_words.split(',') : [],
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
      trigger_words: (value) => {
        if (value.length > 0) {
          return null;
        }
        return 'Required';
      },
    },
  });
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(props?.data?.id !== null);
  const [isEditSuccess, setIsEditSuccess] = useState('');
  const [obsOverlayURL, setObsOverlayURL] = useState(props?.data?.id ? window.location.origin + '/display/' + props.data.id : '');

  return (
    <>
      <Modal 
        opened={props.isOpened} 
        onClose={() => {
          CreateForm.reset();
          setError('');
          setWarning('');
          setIsEditSuccess('');
          setIsSubmitted(false);
          setObsOverlayURL('');
          props.close();
        }} 
        title="Create Monster"
        size="xl"
      >
        <Alerts
          error={error}
          warning={warning}
          success={isEditSuccess}
        />

        <form onSubmit={CreateForm.onSubmit(async (values) => {
          // check if any changes have been made
          if (props?.data?.id && 
            (props.data.name === values.name) &&
            (props.data.published.toString() === values.published) &&
            (props.data.hp_multiplier === values.hp_multiplier) &&
            (props.data.trigger_words?.trim() === values.trigger_words.join(',').trim())
          ) {
            setWarning('No changes made to the original content');
          } else {
            try {
              const result = await fetch(
                props?.data?.id ? '/api/monsters/' + props.data.id : '/api/monsters',
                { 
                  method: props?.data?.id ? 'PUT' : 'POST',
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify({
                    ...values,
                    published: values.published === 'true',
                  }),
                },
              );
              if (result) {
                const responseJson = await result.json();
                if (responseJson.success) {
                  setObsOverlayURL(window.location.origin + '/display/' + responseJson.data[0].id);

                  // update main page list in parent component
                  if (!props?.data?.id) {
                    // new monster
                    setIsSubmitted(true);
                    props.setMonsters((prev) => ([
                      ...prev,
                      responseJson.data[0],
                    ]))
                  } else {
                    // edited monster
                    props.setMonsters((prev) => prev.map((item) => item.id === responseJson.data[0].id ? responseJson.data[0] : item));
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
          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Name"
            placeholder="Mr. Snake"
            {...CreateForm.getInputProps('name')}
          />
          <NumberInput
            className={classes['margin-bottom-1']}
            required
            label="HP Per-Chat User"
            {...CreateForm.getInputProps('hp_multiplier')}
          />
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
            mt="xl"
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

          {isSubmitted && (
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
                When enabled, the Twitch chat bot will count trigger strings to affect its health.
              </div>
            </Alert>
          )}

          <CopyButton 
            value={obsOverlayURL}
          >
            {({ copied, copy }) => (
              <Grid 
                className={classes['margin-bottom-1']}
                mt="xl" 
                justify="center" 
                style={{alignItems: 'center'}}
              >
                <Grid.Col span={9}>
                  <TextInput 
                    label="OBS Overlay URL"
                    disabled={!isSubmitted}
                    readOnly
                    mt="xs"
                    placeholder="OBS Overlay URL"
                    value={obsOverlayURL}
                  />
                </Grid.Col>
                <Grid.Col span={1} style={{ display: 'flex', alignItems: 'end' }}>
                  <Button 
                    disabled={!isSubmitted}
                    mt={'xs'}
                    variant="outline"
                    color={copied ? 'teal' : theme.colors.indigo[5]} 
                    onClick={copy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </Grid.Col>
              </Grid>
            )}
          </CopyButton>
          
          {!isSubmitted && (
            <Group justify="center" mt="xl">
              <Button 
                color={theme.colors.indigo[5]}
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
                leftSection={
                  <GiMonsterGrasp 
                    size="1rem" 
                    stroke={1.5} 
                  />
                }
              >
                Edit
              </Button>
            </Group>
          )}
        </form>
      </Modal>
    </>
  );
}

export default ItemModal;
