
import { 
    Button,
    CopyButton,
    Grid,
    TextInput,
  } from '@mantine/core';
  import classes from '../../../css/Nav.module.css';
  import { theme } from '../../../../theme';
  
  interface Props {
    url: string,
    details: {
      label: string,
      description: string,
    }
  }
  
  function CopyURL(props: Props) {
    return (
      <>
        <CopyButton 
          value={props.url}
        >
        {({ copied, copy }) => (
          <Grid 
            className={classes['margin-bottom-1']}
            mt="xl" 
            justify="center" 
            style={{alignItems: 'center'}}
          >
            <Grid.Col span={9}>
              <TextInput 
                label={props.details.label}
                description={props.details.description}
                readOnly
                mt="xs"
                placeholder={props.details.label}
                value={props.url}
              />
            </Grid.Col>
            <Grid.Col span={1} style={{ display: 'flex', alignItems: 'end' }}>
              <Button 
                mt={'xs'}
                variant="outline"
                color={copied ? 'teal' : theme.colors.indigo[5]} 
                onClick={copy}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Grid.Col>
          </Grid>
        )}
        </CopyButton>
      </>
    );
  }
  
  export default CopyURL;
  