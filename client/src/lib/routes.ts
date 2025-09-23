export const allUsersRoute = () => '/users';
export const oneUserRoute = ({ id }: { id: string }) => `/users/${id}`;
export const loginRoute = () => '/login';
export const registerRequestCreateRoute = () => '/register-request';
export const registerRequestsAdminRoute = () => '/admin/register-requests';
export const completeRegistrationRoute = () => '/complete-registration';
