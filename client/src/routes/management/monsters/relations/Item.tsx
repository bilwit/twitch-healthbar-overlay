
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
  setError?: React.Dispatch<React.SetStateAction<string>>,
  setSelectList: React.Dispatch<React.SetStateAction<string[]>>,
} 
  
function Item(props: Props) {
  const remove = async () => {
    try {
      const result = await fetch(
        '/api/monsters/relations/' + props.data?.id,
        { 
          method: 'DELETE',
        },
      );
  
      if (result) {
        const responseJson = await result.json();
        if (responseJson.success && responseJson?.data?.[0]?.id) {
          props.setData((prev) => {
            const test = prev.filter((item) => item.id !== responseJson.data[0].id);
            console.log(test)
            return prev.filter((item) => item.id !== responseJson.data[0].id);
          });
          props.setSelectList((prev) => ([...prev, responseJson.data[0].name]));
          return true;
        } else {
          if (responseJson?.msg) {
            throw responseJson.msg;
          }
          throw '';
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

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
                  e.stopPropagation();
                  remove();
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
  