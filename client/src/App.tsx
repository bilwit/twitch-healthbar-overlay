import { useDisclosure } from '@mantine/hooks';
import { MantineProvider, AppShell, Burger, DEFAULT_THEME } from '@mantine/core';
import "@mantine/core/styles.css";
import './App.css';

// default theme values https://mantine.dev/theming/default-theme/

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={DEFAULT_THEME} defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>Logo</div>
        </AppShell.Header>

        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

        <AppShell.Main>Main</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App
