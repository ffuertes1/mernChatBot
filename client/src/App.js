// src/App.js - Frontend of the SaaS chatbot
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [token, setToken] = useState('');

  const register = async () => {
    await axios.post('http://localhost:5000/register', { username, password });
    alert('User registered');
  };

  const login = async () => {
    const res = await axios.post('http://localhost:5000/login', { username, password });
    setToken(res.data.token);
    alert('User authenticated');
  };

  const sendMessage = async () => {
    const res = await axios.post('http://localhost:5000/chat', { message, token });
    setResponse(res.data.response);
  };

  return (
    <div className="App">
      <h1>AI SaaS Chat Bot</h1>

      <h2>Registration / Login</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <h2>Chat</h2>
      <input placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default App;
