import Dashboard from './Dashboard';
import { Outlet } from 'react-router-dom';

function PersonalAccount() {
  return (
    <div className='personal-account-page'>
      <Dashboard/>
      <div className='personal-account-content'>
        <Outlet/>
      </div>
    </div>
  )
}

export default PersonalAccount