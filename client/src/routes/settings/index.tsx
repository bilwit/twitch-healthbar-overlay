
import { 
  SimpleGrid,
} from '@mantine/core';
import useGetSettings from './useGetSettings';

function Settings() {
  const { settings } = useGetSettings();

  console.log(settings)
  
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 5 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </SimpleGrid>
  );
}

export default Settings;
