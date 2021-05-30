"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function App() {
  
    return (
      <UserLogin />
    );
  }

ReactDOM.render(
    <App />,
    document.getElementById('task'));