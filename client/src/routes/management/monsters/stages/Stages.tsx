
import { 
  Alert,
  Accordion,
  LoadingOverlay,
} from '@mantine/core';
import { BiInfoCircle } from 'react-icons/bi';
import Item from './Item';
import useGetData from '../../useGetData';
  
interface Props {
  refId: number,
}

function Stages(props: Props) {
  const { 
    isLoading, 
    data, 
    setData, 
  } = useGetData('monsters/stages', String(props.refId));

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

      <Accordion>
        <Item 
          ref_id={props.refId} 
          setData={setData}
          accordian_key="new"
          title="Add Stage"
        />
        {isLoading ? (
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        ) : data.sort((a, b) => a.hp_value < b.hp_value ? 1 : -1).map((item) => (
          <Item 
            key={item.id}
            ref_id={props.refId} 
            setData={setData}
            data={item}
            accordian_key={String(item.id)}
            title={item.hp_value + '%'}
          />
        ))}
      </Accordion>
    </>
  );
}

export default Stages;
  