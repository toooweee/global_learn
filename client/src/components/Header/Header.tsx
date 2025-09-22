import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to={'/'}>
        <img src="" alt="logo" />
      </Link>

      <ul>
        <li>
          <Link to={'/users'}>Users</Link>
        </li>
        <li>
          <a href="">Companies</a>
        </li>
      </ul>

      <div>
        <button>Выйти</button>
      </div>
    </header>
  );
};

export default Header;
