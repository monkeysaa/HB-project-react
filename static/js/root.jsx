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
  const [showNav, setShowNav] = React.useState(null);
  const history = ReactRouterDOM.useHistory();
  const login = document.getElementById('login_state');
  
  React.useEffect(() => {
    if (login.getAttribute('data-loggedin') === 'True') {
      setShowNav(<Route><Nav/></Route>);
    }
    else {
      setShowNav(
        <Route>
          <header>
          <img src='/static/img/desk-trans.png/'/>
          <h1>DESK</h1>
          <Link to="/login"><i className="fa fa-user-circle"></i> </Link> 
          </header>
        </Route>
      )
    }
  }, [login]);
  console.log(`Line 35, ${showNav}`)

  React.useEffect(() => {
    (login.getAttribute('data-loggedin') === 'True') ? setShowNav(true) : setShowNav(false)
  }, [login]);


  // Create a Slate editor object that won't change across renders. 
  // const editor = useMemo(() => withReact(createEditor()), [])
  // // if not logged in, send to Search


  // No Nav while not logged in... except maybe an option to Search and sign up?
  // Once logged in, here's the Nav, then body send to Profile
  return (
    <React.Fragment>
      {showNav}
      <main>  
        <Switch>
          {/* Pre-signup Routes */}
          <Route exact={true} path="/">
            <Home />
          </Route> 
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <CreateNewUser greeting="Sign up to create or save your next lesson!"/>
          </Route>

          {/* Pre-signup Routes */}
          <Route path="/profile">
              <Profile />
          </Route>
          <Route exact={true} path="/users">
            <Directory />
          </Route>
          {/* Does this route go to profile? Will users ever see this?  */}
      
          <Route path="/lessons/:lesson_id/edit" children={<EditLesson/>}/>
          <Route path="/lessons/:lesson_id" children={<SingleLesson />} />
          <Route path="/create_lesson">
            <NewLesson />
          </Route>


          <Route exact={true} path="/search/:params" children={<Search/>} />
          <Route path="/search">
            <Search />
          </Route>
        </Switch>
      </main>
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