import Basic from "./bars/themes/Basic"

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
      )
  }
}
