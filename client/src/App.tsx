import Header from './components/Header/Header.tsx';
import { Route, Routes } from 'react-router-dom';
import UsersPage from './pages/Users/AllUsersPage/Users.page.tsx';
import UserPage from './pages/Users/OneUserPage/User.page.tsx';
import { allUsersRoute, oneUserRoute } from './lib/routes.ts';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path={allUsersRoute()} element={<UsersPage />} />
        <Route path={oneUserRoute({ id: ':id' })} element={<UserPage />} />
      </Routes>
    </>
  );
};

export default App;
