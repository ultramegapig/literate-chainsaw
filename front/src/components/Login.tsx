import React, { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access_token: string }>('http://127.0.0.1:5000/api/user/login', {
        email,
        password,
        otp,
      });

      const { access_token } = response.data;
      const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        user_id: decodedToken.sub.user_id,
        first_name: decodedToken.sub.first_name,
        last_name: decodedToken.sub.last_name,
        email: decodedToken.sub.email,
        role: decodedToken.sub.role,
        group_id: decodedToken.sub.group_id
      };

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        token: access_token,
        user: user,
      });
      setMessage('Login successful!');
      navigate('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Неправильный логин и/или пароль.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <h2>Вход</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Почта"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
          </div>
          <div className="remember-forgot-container">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Запомнить меня</label>
            </div>
            <a href="#" className="forgot-password">Забыли пароль?</a>
          </div>
          <div className="form-group otp">
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Одноразовый код"
              required
            />
            <p>*Введите одноразовый код из приложения Google Authenticator</p>
          </div>
          {message && <p>{message}</p>}
          <button type="submit">Войти</button>
        </form>
        <div className='form-registration'>
          <p>Ещё нет аккаунта?</p>
          <Link to="/register" className="register-link">Зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;