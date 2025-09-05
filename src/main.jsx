// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';   // <- Tailwind & base styles

createRoot(document.getElementById('root')).render(<App />);