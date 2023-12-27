import { Title } from "@mantine/core";

interface Props {
  isLoading: boolean,
  value: number,
  maxHealth: number,
}

function CounterPercentage(props: Props) { 
  const value = props.value / props.maxHealth * 100;

  return (
    <>
      {!props.isLoading && (
        <>
          <Title order={1}>{value + '%'}</Title>
        </>
      )}
    </>
  );
}

export default CounterPercentage;
