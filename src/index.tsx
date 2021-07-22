/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 15:32:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-22 18:03:01
 * @FilePath: \mindmap\src\index.tsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
