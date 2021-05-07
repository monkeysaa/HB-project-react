"use strict";

// Eventually, this goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function Controller() {
  return (
    <Switch>
      <Route path="/smile">
        <Smile />
      </Route>
      <Route path="/">
        <Home />
      </Route> 
    </Switch>
  );
}

function Home() {
  return (
    <React.Fragment>
      <Link to="/smile">Test...</Link>
    </React.Fragment>
  );
}

function Smile() {
  const [title, setTitle] = React.useState([""]);
  const [comps, setComps] = React.useState([]);

  React.useEffect(() => {
    fetch("/lessons/1.json")
        .then((response) => response.json())
        .then((data) => console.log(data.lesson[0].title))
  }, "");

  return (
    <React.Fragment>
      <img src="/static/img/high5.jpg"></img>
      <h2>{title}</h2>
    </React.Fragment>
  );
}

ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('task'));