import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Auth from './views/Auth'
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalAccount from './views/PersonalAccount';
import {routes} from "./routes";
import Polygon from './views/Polygon';
import ListCoordinates from "./views/ListCoordinates";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.login} element={<Auth/>} name='dasd'/>
        <Route
          path={routes.home}
          element={
            <ProtectedRoute>
              <PersonalAccount/>
            </ProtectedRoute>
          }>
          <Route path={routes.createPolygon} element={<Polygon />} />
          <Route path={routes.listPolygon} element={<ListCoordinates />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
