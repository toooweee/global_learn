import { useParams } from 'react-router-dom';
import { trpc } from '../../../lib/trpc.provider.tsx';

const UserPage = () => {
  const { id } = useParams() as { id: string };

  if (!id) {
    return (
      <div>
        <p>No id provided</p>
      </div>
    );
  }

  const { data, error, isError, isFetching, isLoading } = trpc.usersRouter.findUser.useQuery({ id });

  return (
    <div>
      <div>
        <h1>{data?.email}</h1>

        <p>his id is {data?.id}</p>
      </div>
    </div>
  );
};

export default UserPage;
