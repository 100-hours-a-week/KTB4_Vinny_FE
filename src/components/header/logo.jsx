import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link className="site-header__title" to="/">
      CINEON
    </Link>
  );
}