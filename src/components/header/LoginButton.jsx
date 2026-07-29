import Button from '../Button/Button';
import styles from './LoginButton.module.scss';

export default function LoginButton({ to = '/login' }) {
  return (
    <Button className={styles.loginButton} size="small" to={to}>
      로그인
    </Button>
  );
}
