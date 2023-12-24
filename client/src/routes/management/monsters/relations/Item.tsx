
import { 
  Button, 
  Card, 
  Text, 
  Group,
  Avatar,
  Stack,
  Badge,
  Space,
} from '@mantine/core';
import { GiMonsterGrasp } from 'react-icons/gi';
import { Monster } from '../../useGetData';
import { MdDelete } from 'react-icons/md';
  
interface Props {
  data?: Monster,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
} 
  
function Item(props: Props) {
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" mr="1" pb="xs" withBorder>
        <Card.Section mt={0} mb="xs">
          <div style={{ display: 'flex' }}>
            {props?.data?.avatar_url ? (
              <Avatar 
                src={window.location.origin + '/api/avatar/' + props.data.avatar_url} 
                radius="xl" 
                size="lg" 
                ml="lg"
                mt="sm"
              />
            ) : (
              <GiMonsterGrasp size={150} />
            )}

            <Space w="md" />

            <Stack gap="0">
              <Text fw={600} mb="sm">{props.data?.name}</Text>
              <Badge
                color={props.data?.published ? 'green' : 'dark'} 
                variant="light"
              >
                {props.data?.published ? 'Enabled' : 'Disabled'}
              </Badge>
            </Stack>

            <Stack gap="0" ml="lg">
              <Text size="xs" c="dimmed">
                Created
              </Text>
              <Text size="sm">
                {props.data?.created_at ? (new Date(props.data.created_at)).toDateString() : ''}
              </Text>

              <Text size="xs" c="dimmed" mt="sm">
                Health Multiplier
              </Text>

              <Text size="sm">
                {props.data?.hp_multiplier}
              </Text>
            </Stack>

            <Space w="md" />

            <Group>
              <Button 
                justify='end'
                variant="light" 
                color="red" 
                radius="md"
                ml="xl"
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                leftSection={
                  <MdDelete  
                    size="1rem" 
                    stroke={1.5} 
                  />
                }
              >
                Remove
              </Button>
            </Group>
          </div>
                    
        </Card.Section>
      </Card>
    </>
  );
}
  
export default Item;
  