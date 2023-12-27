import { Title } from "@mantine/core";

interface Props {
  isLoading: boolean,
  value: number,
}

function CounterRaw(props: Props) { 
  return (
    <>
      {!props.isLoading && (
        <>
          <Title order={1}>{props.value}</Title>
        </>
      )}
    </>
  );
}

export default CounterRaw;
