
interface Props {
  isLoading: boolean,
  value: number,
  maxHealth: number,
}

function CounterPercentage(props: Props) { 
  const value = props.value / props.maxHealth * 100;

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      {!props.isLoading && (
        <>
          {value + '%'}
        </>
      )}
    </div>
  );
}

export default CounterPercentage;
