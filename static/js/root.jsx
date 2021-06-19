"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, 
        Prompt, Link, Route } = ReactRouterDOM;

// const { Card, Button, ListGroup, ListGroupItem } = ReactBootstrap;
// import { createEditor } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react'
// import { ShowLessonTest } from 'display_lesson.jsx';

function Controller() {
  const history = ReactRouterDOM.useHistory();
  const showNav = false;
  const loggedIn = document.getElementById('login_state');

  
  if (loggedIn.dataset.loggedin === 'False') {
    return (
      <React.Fragment>
        <Nav showNav={false} />
        <main>
          <Switch>
            <Route path="/login"><Login /></Route>
            <Route exact={true} path="/"><Home/></Route>
          </Switch>
        </main>
      </React.Fragment>
    );
  } 
  else if (loggedIn.dataset.loggedin === 'True') {
    return (
      <React.Fragment>
       <Nav showNav={true} />
        <main>
        <Switch>
          <Route path="/directory"><Directory /></Route>
          <Route path="/lessons/:lesson_id/edit" children={<EditLesson/>}/>
          <Route path="/lessons/:lesson_id" children={<SingleLesson />} />
          <Route path="/signup"><CreateNewUser /></Route>
          <Route path="/create_lesson"><NewLesson /></Route>
          <Route path="/login"><Login /></Route>
          <Route path="/profile"><Profile /></Route>
          <Route exact={true} path="/search/:params" children={<Search/>} />
          <Route path="/search"><Search /></Route>
          <Route exact={true} path="/"><Home /></Route> 
        </Switch>
        </main>
      </React.Fragment>
    );
  } 


}

ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('root'));