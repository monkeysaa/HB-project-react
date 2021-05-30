"use strict";

// If I need a package, how do I get them?
// This goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

// import { ShowLessonTest } from 'display_lesson.jsx';

function Controller() {
  // variable names: hyphens for class, underscores for IDs, camel for other names
  const loggedIn = document.getElementById('login_state')

  // // if not logged in, send to Search
  if (loggedIn.dataset.loggedin === 'False') {
    return (
      <React.Fragment>
        <Login />
      </React.Fragment>
    );
  } 

  // if logged in, here's the Nav, then body send to Profile
  return (
    <Switch>
      <Route path="/users">
        <UserLessonList />
      </Route>
      <Route path="/lesson">
        <ShowLesson />
      </Route>
      <Route path="/signup">
        <CreateNewUser />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route path="/profile">
        <Profile />
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
      <nav>
        <Link to="/profile">Profile</Link>
        <Link to="/users">Users and Lessons</Link>
        <Link to="/lesson">Test Lesson</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/logout">Log Out</Link>
      </nav>
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




ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('task'));