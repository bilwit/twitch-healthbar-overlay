
import { 
    Affix,
    Alert,
    Button,
    LoadingOverlay,
    SimpleGrid,
  } from '@mantine/core';
  import classes from '../../../css/Nav.module.css';
  import { BiError, BiInfoCircle } from 'react-icons/bi';
  import { theme } from '../../../theme';
  import { useDisclosure } from '@mantine/hooks';
  import useGetData from '../useGetData';
import { MdBattery1Bar } from 'react-icons/md';
import ItemModal from './ItemModal';
  
  function HealthBars() {
    const { 
      isLoading, 
      data: healthBars, 
      setData: setHealthBars, 
      error,
    } = useGetData('monsters');
    const [isOpened, { open, close }] = useDisclosure(false);
  
    return (
      <>
        {error && (
          <Alert 
            className={classes['margin-bottom-1']}
            variant="light" 
            color="red" 
            title="Error" 
            icon={
              <BiError 
                size="1rem" 
                stroke={1.5} 
              />
            }
          >
            {error}
          </Alert>
        )}
  
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {!isLoading ? healthBars && healthBars.length > 0 ? healthBars.map((healthBar) => (
            'hello'
            // <MonsterCard key={monster.id}
            //   item={monster}
            //   setMonsters={setMonsters}
            // />
          )) : (
            <Alert 
              className={classes['margin-bottom-1']}
              variant="light" 
              color="indigo" 
              title="Note" 
              icon={
                <BiInfoCircle 
                  size="1rem" 
                  stroke={1.5} 
                />
              }
            >
              No monsters added yet
            </Alert>
          ) : (
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
          )}
        </SimpleGrid>
  
        <Affix 
          position={{ bottom: 20, right: 20 }} 
          style={{ zIndex: 190 }}
        >
          <Button
            color={theme.colors.grape[5]}
            leftSection={
              <MdBattery1Bar 
                size="1rem" 
                stroke={1.5} 
              />
            }
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            Create
          </Button>
  
          <ItemModal 
            isOpened={isOpened}
            close={close}
            setData={setHealthBars}
          />
        </Affix>
      </>
    );
  }
  
  export default HealthBars;
  