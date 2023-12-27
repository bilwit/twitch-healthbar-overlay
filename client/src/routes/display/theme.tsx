import Basic from "./bars/themes/Basic";
import CounterPercentage from "./bars/themes/CounterPercentage";
import CounterRaw from "./bars/themes/CounterRaw"

export const theme = (theme: string, isLoading: boolean, value: number, maxHealth: number) => {
  switch (theme) {
    default:
    case 'basic':
      return (
        <Basic
          isLoading={isLoading}
          value={value}
          maxHealth={maxHealth}
        />
      );
    case 'counter_raw':
      return (
        <CounterRaw
          isLoading={isLoading}
          value={value}
        />
      );
    case 'counter_percentage':
      return (
        <CounterPercentage
          isLoading={isLoading}
          value={value}
          maxHealth={maxHealth}
        />
      );
  }
}
