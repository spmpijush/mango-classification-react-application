import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import AppV3 from './AppV3';
import reportWebVitals from './reportWebVitals';
// import AppOld from './AppOld';
// import Frontend from './Frontend';


ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Frontend /> */}
    {/* <AppOld/> */}
    <AppV3 />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
