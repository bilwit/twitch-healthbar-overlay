import { useDisclosure } from '@mantine/hooks';
import { 
  MantineProvider, 
  AppShell, 
  Burger, 
  Grid,
  NavLink,
} from '@mantine/core';
import { theme } from './theme';
import classes from './css/Nav.module.css';
import "@mantine/core/styles.css";

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header className={classes['align-content-center'] + ' ' + classes['nav-bar-dark']}>
          <Grid >
            <Grid.Col span={1} hiddenFrom="sm">
              <Burger 
                opened={opened} 
                onClick={toggle} 
                hiddenFrom="sm" size="sm" 
                className={classes['nav-burger']}
              />
            </Grid.Col>
            <Grid.Col span={11}>
              <h2 className={classes['nav-header']}>Protons Electrons Always Cause Explosions</h2>
            </Grid.Col>
          </Grid>          
        </AppShell.Header>

        <AppShell.Navbar 
          p="md"
          className={classes['nav-bar']}
        >
          <NavLink 
            label="Health Bar Overlay" 
            className={classes['nav-link']}
            active={true}
          />
        </AppShell.Navbar>

        <AppShell.Main
        >
          Main
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
