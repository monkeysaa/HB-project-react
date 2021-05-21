"use strict";
// Include a script tag into JS interpreter

// If I need a package, how do I get them?
// Eventually, this goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

// import { ShowLessonTest } from 'display_lesson.jsx';

function Controller() {
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
      <Route path="/">
        <Home />
      </Route> 
    </Switch>
  );
}

function Home() {
  return (
    <React.Fragment>
      <Link to="/lesson">Test Lesson</Link><br/>
      <Link to="/users">Users and Lessons</Link><br/>
      <Link to="/login">Login</Link><br/>
      <Link to="/signup">Sign Up</Link>
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