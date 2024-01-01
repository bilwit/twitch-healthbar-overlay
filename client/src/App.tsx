import { Route, Routes } from 'react-router-dom';
import Management from './routes/management';
import Display from './routes/display';

function App() {  
  return (
    <Routes>
      <Route
        path="/*"
        element={<Management />}
      />
      <Route
        path="display/*"
        element={<Display />}
      />
    </Routes>
  );
}

export default App;
