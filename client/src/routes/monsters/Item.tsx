
import { 
  Card,
} from '@mantine/core';
import { Monster } from './useGetMonsters';

interface Props {
  item: Monster,
}

function Monsters(props: Props) {
  
  return (
    <>
      <Card>
        {props.item.name}
      </Card>
    </>
  );
}

export default Monsters;
