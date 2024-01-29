import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import StarRatings from './StarRatings';
import Appcopy from './Appcopy';
// import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <StarRatings />
    <StarRatings maxRating={10} size='23' /> */}
    <Appcopy />
  </React.StrictMode>
);


