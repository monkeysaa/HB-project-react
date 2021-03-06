"use strict";
// variable names: hyphens for class, underscores for IDs, camel for other names
// If I need a package, how do I get them?
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, 
        Prompt, Link, Route } = ReactRouterDOM;

// const { Card, Button, ListGroup, ListGroupItem } = ReactBootstrap;
// import { createEditor } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react'
// import { ShowLessonTest } from 'display_lesson.jsx';

function Controller() {
  const history = ReactRouterDOM.useHistory();
  const loggedIn = document.getElementById('login_state')

  // Create a Slate editor object that won't change across renders. 
  // const editor = useMemo(() => withReact(createEditor()), [])
  // // if not logged in, send to Search
  if (loggedIn.dataset.loggedin === 'False') {
    return (
      <React.Fragment>
        <Nav/>
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
        <Route path="/users">
          <Directory />
        </Route>
        <Route path="/lesson/:lesson_id/edit" children={<EditLesson/>}/>
        <Route path="/lesson/:lesson_id" children={<SingleLesson />} />
        <Route path="/signup">
          <CreateNewUser />
        </Route>
        <Route path="/create_lesson">
          <NewLesson />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route exact={true} path="/">
          <img src="/static/img/high5.jpg"/>
        </Route> 

      </Switch>
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

ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('root'));