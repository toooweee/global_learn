import { Route, Routes } from 'react-router-dom';
import UsersPage from './pages/Users/AllUsersPage/Users.page.tsx';
import {
  allUsersRoute,
  oneUserRoute,
  loginRoute,
  meRoute,
  registerRequestCreateRoute,
  registerRequestsAdminRoute,
  completeRegistrationRoute,
  directionsRoute,
  legalFormsRoute,
  departmentsRoute,
  positionsRoute,
  companiesRoute,
} from './lib/routes.ts';
import Layout from './components/Layout/Layout.tsx';
import NotFoundPage from './pages/NotFound/NotFound.page.tsx';
import LoginPage from './pages/Auth/Login.page.tsx';
import CreateRegisterRequestPage from './pages/RegisterRequests/CreateRegisterRequest.page.tsx';
import AdminRegisterRequestsPage from './pages/RegisterRequests/AdminList.page.tsx';
import CompleteRegistrationPage from './pages/RegisterRequests/CompleteRegistration.page.tsx';
import DirectionsPage from './pages/Directions/Directions.page.tsx';
import LegalFormsPage from './pages/LegalForms/LegalForms.page.tsx';
import DepartmentsPage from './pages/Departments/Departments.page.tsx';
import PositionsPage from './pages/Positions/Positions.page.tsx';
import CompaniesPage from './pages/Companies/Companies.page.tsx';
import RequireAuth from './lib/RequireAuth.tsx';
import RequireRole from './lib/RequireRole.tsx';
import HomeRedirect from './pages/HomeRedirect.tsx';
import HomePage from './pages/Home/Home.page.tsx';
import MePage from './pages/Me/Me.page.tsx';

const App = () => {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path={meRoute()}
            element={
              <RequireAuth>
                <MePage />
              </RequireAuth>
            }
          />
          <Route
            path={allUsersRoute()}
            element={
              <RequireRole allow={['ADMIN']}>
                <UsersPage />
              </RequireRole>
            }
          />
          <Route
            path={registerRequestsAdminRoute()}
            element={
              <RequireRole allow={['ADMIN']}>
                <AdminRegisterRequestsPage />
              </RequireRole>
            }
          />
          <Route
            path={directionsRoute()}
            element={
              <RequireRole allow={['ADMIN']}>
                <DirectionsPage />
              </RequireRole>
            }
          />
          <Route
            path={legalFormsRoute()}
            element={
              <RequireRole allow={['ADMIN']}>
                <LegalFormsPage />
              </RequireRole>
            }
          />
          <Route
            path={departmentsRoute()}
            element={
              <RequireRole allow={['CLIENT_ADMIN']}>
                <DepartmentsPage />
              </RequireRole>
            }
          />
          <Route
            path={positionsRoute()}
            element={
              <RequireRole allow={['CLIENT_ADMIN']}>
                <PositionsPage />
              </RequireRole>
            }
          />
          <Route
            path={companiesRoute()}
            element={
              <RequireAuth>
                <CompaniesPage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path={'*'} element={<NotFoundPage />} />
        <Route path={loginRoute()} element={<LoginPage />} />
        <Route path={registerRequestCreateRoute()} element={<CreateRegisterRequestPage />} />
        <Route path={completeRegistrationRoute()} element={<CompleteRegistrationPage />} />
        <Route
          path={meRoute()}
          element={
            <RequireAuth>
              <MePage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

export default App;
