import { Route, Routes } from "react-router-dom";
import Bars from './bars';

function Display() {
  return (
    <Routes>
      <Route
        path="bars/*"
        element={<Bars />}
      />
    </Routes>
  );
}

export default Display;
