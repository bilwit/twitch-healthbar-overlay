import { useDisclosure } from '@mantine/hooks';
import { 
  MantineProvider, 
  AppShell, 
  Burger, 
  Grid,
  NavLink,
} from '@mantine/core';
import { theme } from '../../theme';
import classes from '../../css/Nav.module.css';
import "@mantine/core/styles.css";
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Monsters from './monsters';
import Settings from './settings';
import { GiMonsterGrasp } from 'react-icons/gi';
import { VscSettingsGear } from 'react-icons/vsc';
import useGetSettings from './settings/useGetSettings';
import { useEffect } from 'react';
import useWsMonster from '../display/useWsMonster';
import WsContext from '../../wsContext';

interface Routes_Icon_Dictionary {
  [key: string]: JSX.Element,
}

const routes_icon_dictionary: Routes_Icon_Dictionary = {
  'monsters': (<GiMonsterGrasp size="1rem" stroke={1.5}/>),
  'settings': (<VscSettingsGear size="1rem" stroke={1.5} />),
}

function Management() {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    data,
    isConnected, 
    connectedSocket
  } = useWsMonster();  

  const { isLoading, settings } = useGetSettings();
  
  const [opened, { toggle }] = useDisclosure();
  const [settingsIsOpened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!isLoading && !settings) {
      open();
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (connectedSocket) {
        connectedSocket.close();
      }
    }
  }, [connectedSocket]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <WsContext.Provider value={{ data, isConnected, connectedSocket }}>
        <Settings
          settings={settings}
          isOpened={settingsIsOpened}
          close={close}
        />

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
          {Object.keys(routes_icon_dictionary).map((item) => {
            return (
              <NavLink 
                key={'nav' + item}
                color={theme.colors.indigo[5]}
                leftSection={routes_icon_dictionary[item]}
                label={item[0].toUpperCase() + item.slice(1, item.length)} 
                className={classes['nav-link']}
                active={(item === 'settings' && settingsIsOpened) || (!settingsIsOpened && location.pathname === '/' + item)}
                onClick={(e) => {
                  e.preventDefault();
                  if (item === 'settings') {
                    return open();
                  }
                  return navigate(item);
                }}
              />
            );
          })}
          </AppShell.Navbar>

          <AppShell.Main>
            <Routes>
              <Route
                path="/*"
                element={<Navigate to="/monsters" />}
              />
              <Route
                path="/monsters/*"
                element={<Monsters />}
              />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </WsContext.Provider>
    </MantineProvider>
  );
}

export default Management;
