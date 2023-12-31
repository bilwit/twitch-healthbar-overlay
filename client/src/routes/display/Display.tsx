import { Route, Routes } from "react-router-dom";
import Bars from './bars';
import Avatars from "./avatars";

function Display() {  
  return (
    <Routes>
      <Route
        path="bars/*"
        element={(
          <Bars />
        )}
      />
      <Route
        path="avatars/*"
        element={(
          <Avatars />
        )}
      />
    </Routes>
  );
}

export default Display;
