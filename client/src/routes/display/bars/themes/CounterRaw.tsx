interface Props {
  isLoading: boolean,
  value: number,
}

function CounterRaw(props: Props) { 
  return (
    <div style={{ backgroundColor: 'transparent' }}>
      {!props.isLoading && (
        <>
          {props.value}
        </>
      )}
    </div>
  );
}

export default CounterRaw;
