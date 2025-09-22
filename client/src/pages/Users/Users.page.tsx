import { trpc } from '../../lib/trpc.provider.tsx';

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
          <li>
            <p>id: ${user.id}</p>
            <p>Email: ${user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
