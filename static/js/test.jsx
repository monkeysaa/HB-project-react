"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function App() {
  
    return (
      <UserLogin />
    );
  }

//   function ParamsTest() {
//     // We can use the `useParams` hook here to access
//     // the dynamic pieces of the URL.
//     let { id } = useParams();
//     console.log(`My ID is: ${id}`)
  
//     return (
//       <div>
//         <h3>ID: {id}</h3>
//       </div>
//     );
//   }

ReactDOM.render(
    <App />,
    document.getElementById('task'));