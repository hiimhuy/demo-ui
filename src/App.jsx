import { useEffect, useState } from "react";
import "./App.css";

const baseAPI = "http://localhost:3001/api";

function App() {
  const [fields, setFields] = useState({
    email: "hoangconghuy@gmail.com",
    password: "1",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const setFieldValue = ({ target: { name, value } }) => {
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    fetch(`${baseAPI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({token}) => 
    {
      localStorage.setItem('token',token)
    })
      .catch((error) => {
        if (error.status === 401) {
          return setError("Email hoặc mật khẩu không chính xác");
        }
        setError("Lỗi không xác định!");
      });
  };

  useEffect(() => {
    fetch(`${baseAPI}/auth/me`, {
      credentials: "include",
      headers:{
        Authorization: `Bearer ${localStorage.token}`
      }
    })
      .then((res) => res.json())
      .then((me) => {
        setUser(me);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {user ? (
        <p>xin chao, {user.name}</p>
      ) : (
        <>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              value={fields.email}
              onChange={setFieldValue}
              name="email"
              id="email"
            />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              value={fields.password}
              onChange={setFieldValue}
              name="password"
              id="password"
            />
            <br />
            <button type="submit">Login</button>
          </form>

          {!!error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
