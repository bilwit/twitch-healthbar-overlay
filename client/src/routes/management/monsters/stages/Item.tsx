
import { 
  Button, 
  Card, 
  FileInput, 
  Text, 
  Group,
  Overlay, 
  Image, 
  NumberInput,
  Accordion, 
  Avatar,
  Grid,
} from '@mantine/core';
import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import classes from '../../../../css/Nav.module.css'
import { useForm } from '@mantine/form';
import { MdAdd } from 'react-icons/md';
import { theme } from '../../../../theme';
import Alerts from '../../Alerts';
  
interface Props {
  ref_id: number,
  data?: {
    id: number,
    avatar_url: string,
    hp_value: number,
  },
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  accordian_key: string,
  title: string,
} 

interface FormDataInterface {
  hp_value: number,
  avatarFile: File | null,
  isAvatarChanged: boolean,
}
  
function Item(props: Props) {
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [isEditSuccess, setIsEditSuccess] = useState('');

  const CreateForm = useForm({
    initialValues: {
      ref_id: props.ref_id,
      hp_value: props?.data?.hp_value || 25,
      avatarFile: null,
      isAvatarChanged: false,
    },

    validate: {
      hp_value: (value) => value ? null : 'Required',
      avatarFile: () => null,
    },
  });

  return (
    <>
      <Accordion.Item value={props.accordian_key}>
        <Alerts
          error={error}
          warning={warning}
          success={isEditSuccess}
        />
        <Accordion.Control>
          <Group wrap="nowrap">
            <Avatar 
              src={props?.data?.avatar_url ? window.location.origin + '/api/avatar/' + props?.data?.avatar_url : null} 
              radius="xl" 
              size="lg" 
            />
            <div>
              <Text>{props.title}</Text>
            </div>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={CreateForm.onSubmit(async (values: FormDataInterface) => {
            // check if any changes have been made
            if (!isAvatarChanged && props?.data?.id && 
              (props.data.hp_value === values.hp_value)
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
              if (isAvatarChanged) {
                submitFormData.set('isAvatarChanged', 'true');
              }
              try {
                const result = await fetch(
                  props?.data?.id ? '/api/monsters/stages/' + props.data.id : '/api/monsters/stages',
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
                      // new item
                      props.setData((prev) => ([
                        ...prev,
                        responseJson.data[0],
                      ].sort((a, b) => a.hp_value > b.hp_value ? 1 : -1)));

                      CreateForm.reset();
                      setAvatarFile(null);
                      setAvatar(null);
                      setIsAvatarChanged(false);
                    } else {
                      // edited item
                      props.setData((prev) => prev.map((item) => item.id === responseJson.data[0].id ? responseJson.data[0] : item).sort((a, b) => a.updated_at < b.updated_at ? -1 : 1));
                      setIsEditSuccess('Stage values updated')
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
              <Grid.Col span={7}>
                <Text size="sm">
                  Avatar Preview 
                </Text>
                <Card shadow="sm" padding="lg" radius="sm" withBorder>
                  <Card.Section>
                    {avatar ? (
                      <Image
                        src={avatar}
                        height={75}
                        alt="Image"
                      />
                    ) : props?.data?.avatar_url ? (
                      <Image
                        src={window.location.origin + '/api/avatar/' + props?.data?.avatar_url}
                        height={75}
                        alt="Image"
                      />
                    ) : (
                      <Group justify='center'>
                        <BsFillPersonFill size={75} />
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
              <Grid.Col span={5}>
                <NumberInput
                  className={classes['margin-bottom-1']}
                  required
                  label="Health %"
                  {...CreateForm.getInputProps('hp_value')}
                />
              </Grid.Col>
            </Grid>

            <Group justify="center" mt="xl">
              <Button 
                color={theme.colors.indigo[5]}
                variant="gradient"
                gradient={{ from: theme.colors.indigo[9], to: 'cyan', deg: 90 }}
                type="submit"
                leftSection={
                  <MdAdd  
                    size="1rem" 
                    stroke={1.5} 
                  />
                }
              >
                Create
              </Button>
            </Group>
          </form>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
  
export default Item;
  