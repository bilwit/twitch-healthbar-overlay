
import { 
    Alert,
    Button,
    Card,
    Image,
    FileInput,
    Grid,
    Group,
    NumberInput,
    SegmentedControl,
    Space,
    TagsInput,
    TextInput,
    Text,
    Overlay,
    NativeSelect,
    Stack,
    Accordion,
  } from '@mantine/core';
  import classes from '../../../css/Nav.module.css';
  import { GiMonsterGrasp } from 'react-icons/gi';
  import { useForm } from '@mantine/form';
  import { useState } from 'react';
  import { theme } from '../../../../theme';
  import { BiInfoCircle } from 'react-icons/bi';
  import { BsFillPersonFill } from 'react-icons/bs';
  import { AiFillDelete } from 'react-icons/ai';
  import Alerts from '../../Alerts';
  import CopyURL from '../properties/CopyURL';
import Item from './Item';
  
  interface Props {
    refId?: number,
  }
  
  interface FormDataInterface {
    healthPercentage: number;
    avatarFile: File | null;
  }
  
  function Stages(props: Props) {
    return (
      <>
        <Alert 
          variant="light" 
          color="indigo" 
          title="" 
          mb={"md"}
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={1.5} 
            />
          }
        >
          <div style={{ display: 'flex' }}>
            Change the displayed avatar image based on health percentage.
          </div>
        </Alert>

        <Accordion defaultValue="new">
          <Item refId={props.refId} />
        </Accordion>
      </>
    );
  }
  
  export default Stages;
  