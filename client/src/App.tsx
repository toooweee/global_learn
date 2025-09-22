import UsersPage from './pages/Users/Users.page.tsx';
import Header from './components/Header/Header.tsx';
import { Route, Routes } from 'react-router-dom';
import UserPage from './pages/Users/User.page.tsx';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path={'/users'} element={<UsersPage />} />
        <Route path={'/users/:id'} element={<UserPage />} />
      </Routes>
    </>
  );
};

export default App;
