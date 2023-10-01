
import { 
  Alert,
} from '@mantine/core';
import classes from '../../css/Nav.module.css';
import { BiError, BiInfoCircle } from 'react-icons/bi';

interface Props {
  error?: string,
  warning?: string,
  success?: string
  info?: string,
}

function Alerts(props: Props) {
  return (
    <>
        {props?.error && (
          <Alert 
            mt="xl"
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
            {props.error}
          </Alert>
        )}

        {props?.warning && (
          <Alert 
            mt="xl"
            className={classes['margin-bottom-1']}
            variant="light" 
            color="yellow" 
            title="Warning" 
            icon={
              <BiError 
                size="1rem" 
                stroke={1.5} 
              />
            }
          >
            {props.warning}
          </Alert>
        )}

        {props?.success && (
          <Alert 
            mt="xl"
            className={classes['margin-bottom-1']}
            variant="light" 
            color="cyan" 
            title="Success" 
            icon={
              <BiInfoCircle 
                size="1rem" 
                stroke={1.5} 
              />
            }
          >
            {props.success}
          </Alert>          
        )}

        {props?.info && (
          <Alert 
            mt="xl"
            className={classes['margin-bottom-1']}
            variant="light" 
            color="indigo" 
            title="Info" 
            icon={
              <BiInfoCircle 
                size="1rem" 
                stroke={1.5} 
              />
            }
          >
            {props.info}
          </Alert>          
        )}
    </>
  );
}

export default Alerts;
