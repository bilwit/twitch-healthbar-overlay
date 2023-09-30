
import { 
  Button,
  CopyButton,
  Grid,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  TagsInput,
  TextInput,
} from '@mantine/core';
import classes from '../../../css/Nav.module.css';
import { GiMonsterGrasp } from 'react-icons/gi';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { theme } from '../../../theme';

function Monsters() {
  const [isOpened, { open, close }] = useDisclosure(false);
  const CreateForm = useForm({
    initialValues: {
      name: '',
      published: 'false',
      hp_multiplier: 5,
      trigger_words: [],
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
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [obsOverlayURL, setObsOverlayURL] = useState('');

  return (
    <>
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

      <Modal 
        opened={isOpened} 
        onClose={close} 
        title="Create Monster"
        size="xl"
      >
        <form onSubmit={CreateForm.onSubmit(async (values) => {
          try {
            const result = await fetch(
              '/api/monsters',
              { 
                method: 'POST',
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
                setObsOverlayURL('/display/' + responseJson.data.id);
                setIsSubmitted(true);
                return setError('');
              } else {
                throw true;
              }
            }
          } catch (_err) {
            return setError('Could not submit settings');
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

          <CopyButton 
            value={obsOverlayURL}
          >
            {({ copied, copy }) => (
              <Grid mt="xl" justify="center" style={{alignItems: 'center'}}>
                <Grid.Col span={10}>
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
        </form>
      </Modal>
    </>
  );
}

export default Monsters;
