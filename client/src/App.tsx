import { Route, Routes } from 'react-router-dom';
import UsersPage from './pages/Users/AllUsersPage/Users.page.tsx';
import UserPage from './pages/Users/OneUserPage/User.page.tsx';
import {
  allUsersRoute,
  oneUserRoute,
  loginRoute,
  registerRequestCreateRoute,
  registerRequestsAdminRoute,
  completeRegistrationRoute,
} from './lib/routes.ts';
import Layout from './components/Layout/Layout.tsx';
import NotFoundPage from './pages/NotFound/NotFound.page.tsx';
import LoginPage from './pages/Auth/Login.page.tsx';
import CreateRegisterRequestPage from './pages/RegisterRequests/CreateRegisterRequest.page.tsx';
import AdminRegisterRequestsPage from './pages/RegisterRequests/AdminList.page.tsx';
import CompleteRegistrationPage from './pages/RegisterRequests/CompleteRegistration.page.tsx';
import RequireAuth from './lib/RequireAuth.tsx';
import HomeRedirect from './pages/HomeRedirect.tsx';

const App = () => {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<Layout />}>
          <Route index element={<HomeRedirect />} />
          <Route
            path={allUsersRoute()}
            element={
              <RequireAuth>
                <UsersPage />
              </RequireAuth>
            }
          />
          <Route
            path={oneUserRoute({ id: ':id' })}
            element={
              <RequireAuth>
                <UserPage />
              </RequireAuth>
            }
          />
          <Route
            path={registerRequestsAdminRoute()}
            element={
              <RequireAuth>
                <AdminRegisterRequestsPage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path={'*'} element={<NotFoundPage />} />
        <Route path={loginRoute()} element={<LoginPage />} />
        <Route path={registerRequestCreateRoute()} element={<CreateRegisterRequestPage />} />
        <Route path={completeRegistrationRoute()} element={<CompleteRegistrationPage />} />
      </Routes>
    </>
  );
};

export default App;
