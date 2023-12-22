
import { 
  Alert,
  Accordion,
} from '@mantine/core';
import { BiInfoCircle } from 'react-icons/bi';
import Item from './Item';
  
interface Props {
  refId?: number,
}

function Stages(props: Props) {
  return (
    <>
      <Alert 
        variant="light" 
        color="indigo" 
        title="" 
        mb={"md"}
        icon={
          <BiInfoCircle 
            size="1rem" 
            stroke={1.5} 
          />
        }
      >
        <div style={{ display: 'flex' }}>
          Change the displayed avatar image based on health percentage.
        </div>
      </Alert>

      {props?.refId && (
        <Accordion>
          <Item ref_id={props.refId} />
        </Accordion>
      )}
    </>
  );
}

export default Stages;
  