import { Link } from 'react-router-dom';
import styles from '@/components/button/Button.module.scss';

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  to,
  type = 'button',
  ...props
}) {
  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link className={buttonClassName} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  );
}
