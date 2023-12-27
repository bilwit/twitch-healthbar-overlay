
import { 
  Alert,
} from '@mantine/core';
import classes from '../../css/Nav.module.css';
import { BiError, BiInfoCircle } from 'react-icons/bi';

interface Props {
  error?: string | JSX.Element,
  warning?: string | JSX.Element,
  success?: string | JSX.Element,
  info?: string | JSX.Element,
  title?: string,
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
            title={props?.title || 'Error'} 
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
            title={props?.title || 'Warning'} 
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
            title={props?.title || 'Success'} 
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
            title={props?.title || 'Info'} 
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
