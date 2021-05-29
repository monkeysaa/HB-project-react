"use strict";

// If I need a package, how do I get them?
// This goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

// import { ShowLessonTest } from 'display_lesson.jsx';

function Controller() {
  // variable names: hyphens for class, underscores for IDs, camel for other names
  const loggedIn = document.getElementById('login_state')

  // if not logged in, send to Search
  if (loggedIn.dataset.loggedin === 'False') {
    return (
      <Login />
    );
  } 

  // if logged in, send to Profile
  return (
    <Switch>
      <Route path="/users">
        <UserLessonList />
      </Route>
      <Route path="/lesson">
        <ShowLessonTest />
      </Route>
      <Route path="/signup">
        <CreateNewUser />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact={true} path="/">
        <Nav />
      </Route> 
    </Switch>
  );
}

function Nav() {
  return (
    <React.Fragment>
      <Link to="/lesson">Test Lesson</Link><br/>
      <Link to="/users">Users and Lessons</Link><br/>
      <Link to="/login">Login</Link><br/>
      <Link to="/signup">Sign Up</Link><br/>
      <img src="/static/img/high5.jpg"/>
    </React.Fragment>
  );
}



// Populate Store
// to update Lesson --> full cycle 

// api.js file with API calls.
// JS file to handle API -- everything interfaces with API goes here.
// could use the same API call to back end and remote API
// fetch()

// Look into global states - how does HB want us to handle these? Context providers, original flux pattern, Redux Framework, a few other frameworks...
// React Store management - trigger events, dispatcher dispatches event, API call, triggers another event --> updates Store, 
// 

// One component per file
// Split components by styling
// eg. one way to style formInputs


function App() {
  return 
    <Router>
      <Controller />
    </Router>
}

ReactDOM.render(
  <App />
  document.getElementById('task'));