import './bootstrap.css';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Back from './Components/Back/Back';
import Front from './Components/Front/Front';

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login, logout, authConfig } from './Functions/auth';
import { apikey } from './Functions/key';

function App() {
  // POST => PUT CURRENCY
  useEffect(() => {
    if (false) {
      axios
        .get('https://api.currencyapi.com/v3/latest?apikey=' + apikey)
        .then((res) => {
          axios
            .post('http://localhost:3003/adm/valiuta', res.data, authConfig())
            .then((rs) => console.log(rs));
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth role='user'>
              <Front />
            </RequireAuth>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/logout' element={<LogoutPage />} />
        <Route
          path='/admin'
          element={
            <RequireAuth role='admin'>
              <Back show='admin' />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/cats'
          element={
            <RequireAuth role='admin'>
              <Back show='cats' />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/products'
          element={
            <RequireAuth role='admin'>
              <Back show='products' />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/comments'
          element={
            <RequireAuth role='admin'>
              <Back show='comments' />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// REQUIRE AUTH
function RequireAuth({ children, role }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);

  useEffect(() => {
    axios
      .get('http://localhost:3003/login-check?role=' + role, authConfig())
      .then((res) => {
        if ('ok' === res.data.msg) {
          setView(children);
        } else {
          setView(<Navigate to='/login' replace />);
        }
      });
  }, [children, role]);

  return view;
}

// LOGIN PAGE
function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const doLogin = () => {
    axios.post('http://localhost:3003/login', { user, pass }).then((res) => {
      if ('ok' === res.data.msg) {
        login(res.data.key);
        navigate('/', { replace: true });
      }
    });
  };
  return (
    <div>
      <div>
        name:{' '}
        <input
          type='text'
          value={user}
          onChange={(e) => setUser(e.target.value)}
        ></input>
      </div>
      <div>
        password:{' '}
        <input
          type='password'
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        ></input>
      </div>
      <button onClick={doLogin}>Login</button>
    </div>
  );
}

// LOGOUT PAGE
function LogoutPage() {
  useEffect(() => logout(), []);
  return <Navigate to='/login' replace />;
}

export default App;
