"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, 
        Prompt, Link, Route } = ReactRouterDOM;

function Controller() {
  const history = ReactRouterDOM.useHistory();
  const loggedIn = document.getElementById('login_state')

  // Create a Slate editor object that won't change across renders. 
  // const editor = useMemo(() => withReact(createEditor()), [])
  // // if not logged in, send to Search
  if (loggedIn.dataset.loggedin === 'False') {
    return (
      <React.Fragment>
        <Card/>
        <Login />
      </React.Fragment>
    );
  } 

  // No Nav while not logged in... except maybe an option to Search and sign up?
  // Once logged in, here's the Nav, then body send to Profile
  return (
    <React.Fragment>
      <Nav/>
      <Switch>
        <Route path="/cards">
          <LessonCard />
        </Route>
        <Route exact={true} path="/">
          <img src="/static/img/high5.jpg"/>
        </Route> 
      </Switch>
    </React.Fragment>
  );
}

[
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
].map((variant, idx) => (
  <Alert key={idx} variant={variant}>
    This is a {variant} alert—check it out!
  </Alert>
));

// Tag checkboxes
[
  '4th', 
  '5th', 
  '6th',
].map((name) => (
  <p> {name} </p>
));


ReactDOM.render(
    <Router>
      <Card />
    </Router>,
    document.getElementById('root'));