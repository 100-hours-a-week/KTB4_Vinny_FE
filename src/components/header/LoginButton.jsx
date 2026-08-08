import Button from '@/components/button/Button';
import styles from '@/components/header/LoginButton.module.scss';

export default function LoginButton({ to = '/login' }) {
  return (
    <Button className={styles.loginButton} size="small" to={to} variant="ghost">
      로그인
    </Button>
  );
}
