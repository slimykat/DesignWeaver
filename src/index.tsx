import React from 'react'
import ReactDOM from 'react-dom/client'
import Entry from './Layout.jsx'

import './index.css'


// const root = ReactDOM.createRoot(document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<React.StrictMode> <Entry /> </React.StrictMode>);
root.render( <Entry /> );
// Disabling Strict Mode because we want useEffect to run only once

console.log("Applicaiton is now running")
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
