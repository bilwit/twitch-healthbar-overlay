
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
} from '@mantine/core';
import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import classes from '../../../../css/Nav.module.css'
import { useForm } from '@mantine/form';
import { MdAdd } from 'react-icons/md';
import { theme } from '../../../../theme';
  
interface Props {
  refId?: number,
  data?: {
    avatar_url: string,
    hp_value: number,
  }
} 
  
function Item(props: Props) {
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  const CreateForm = useForm({
    initialValues: {
      hp_value: props?.data?.hp_value || 25,
      avatarFile: null,
    },

    validate: {
      hp_value: (value) => value ? null : 'Required',
      avatarFile: () => null,
    },
  });

  return (
    <>
      <Accordion.Item value={'new'}>
        <Accordion.Control>
          <Group wrap="nowrap">
            <Avatar src={props?.data?.avatar_url} radius="xl" size="lg" />
            <div>
              <Text>Add Stage</Text>
            </div>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <NumberInput
            className={classes['margin-bottom-1']}
            required
            label="Health %"
            {...CreateForm.getInputProps('hp_value')}
          />
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

          <Group justify="center" mt="xl">
            <Button 
              color={theme.colors.indigo[5]}
              variant="gradient"
              gradient={{ from: theme.colors.indigo[9], to: 'cyan', deg: 90 }}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
              }}
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
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}
  
export default Item;
  