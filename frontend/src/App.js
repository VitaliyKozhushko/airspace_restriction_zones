import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Auth from './views/Auth'
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalAccount from './views/PersonalAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route
          path="/personal_account"
          element={
            <ProtectedRoute>
              <PersonalAccount/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
