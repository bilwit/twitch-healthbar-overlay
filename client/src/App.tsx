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
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Monsters from './routes/monsters';
import Settings from './routes/settings';

const paths = [
  'monsters',
  'settings',
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header className={classes['align-content-center']}>
          <Grid>
            <Grid.Col span={1} hiddenFrom="sm">
              <Burger 
                opened={opened} 
                onClick={toggle} 
                hiddenFrom="sm" size="sm" 
                className={classes['nav-burger']}
              />
            </Grid.Col>
            <Grid.Col span={11}>
              <h2 className={classes['nav-header']}>Health Bar Overlay</h2>
            </Grid.Col>
          </Grid>          
        </AppShell.Header>

        <AppShell.Navbar 
          p="md"
          className={classes['nav-bar']}
        >
        {paths.map((item) => {
          return (
            <NavLink 
              key={'nav' + item}
              label={item[0].toUpperCase() + item.slice(1, item.length)} 
              className={classes['nav-link']}
              active={location.pathname === '/' + item}
              onClick={() => navigate(item)}
            />
          );
        })}
        </AppShell.Navbar>

        <AppShell.Main
        >
          <Routes>
            <Route
              path=""
              element={<Navigate to="/monsters" />}
            />
            <Route
              path="monsters/*"
              element={<Monsters />}
            />
            <Route
              path="settings/*"
              element={<Settings />}
            />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
