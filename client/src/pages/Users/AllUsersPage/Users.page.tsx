import { Link } from 'react-router-dom';
import { trpc } from '../../../lib/trpc.provider.tsx';
import { oneUserRoute } from '../../../lib/routes.ts';

const UsersPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.usersRouter.findAllUsers.useQuery();

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: ${error.message}</div>;
  }

  return (
    <div>
      <h1>There are all users</h1>

      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            <Link to={oneUserRoute({ id: user.id })}>
              <p>id: ${user.id}</p>
              <p>Email: ${user.email}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
