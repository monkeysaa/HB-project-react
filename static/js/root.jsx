"use strict";
// If I need a package, how do I get them?
// Eventually, this goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function Controller() {
  return (
    <Switch>
      <Route path="/users">
        <UserList />
      </Route>
      <Route path="/lesson">
        <ShowLessonTest />
      </Route>
      <Route path="/">
        <Home />
      </Route> 
    </Switch>
  );
}


// function LessonList(props) {
//   const [lessonList, setLessonList] = React.useState([])

//   const lessons = []

//   for (const l of props.lessons) {
//     lessons.push(<Lesson key={l.lesson_id} title={l.title}/>)
//   }
//   setLessonList(lessons)

//   return(
//     <ul>
//       {LessonList}
//     </ul>
//   )
// }

function Lesson(props) {
  return (
    <ul>
      <li> {props.title} </li>
    </ul>
  )
}

function User(props) {
  // console.log(props.lessons);

  return (
    <ul>
      <li>
        {props.handle}: {props.email} <br/>
        {props.lessons} 
      </li>
    </ul>
  )
}

function UserList(props) {
  const [allUserList, setAllUserList] = React.useState([])

  React.useEffect(() => {
    fetch('/api/users')
    .then(response => response.json())
    .then(data => {
      const userList = [];
      for (const u of data) {
        const lessons = [];
        for (const l of u.lessons) {
          lessons.push(<Lesson key={l.lesson_id} title={l.title}/>);
        }
        userList.push(<User key={u.user_id} handle={u.handle} email={u.email} lessons={lessons}/>);
      }
      console.log(userList);
      setAllUserList(userList);
    })
  }, [])

  return(
    <ul>
      {allUserList}
    </ul>
  )
}

function Home() {
  return (
    <React.Fragment>
      <Link to="/lesson">Test...</Link>
      <Link to="/users">Users</Link>
    </React.Fragment>
  );
}

function CompTemplate(props) {
  return (
    <div className="component">
      <p> {props.title} </p>
      <img src={props.img} />
      <a href={`${props.link}`}> </a>
    </div>
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

function ShowLessonTest() {
  const [lesson, setLesson] = React.useState([]);
  const [title, setTitle] = React.useState([]);
  const [comps, setComps] = React.useState([]);
  const [lessonPic, setLessonPic] = React.useState([]);
  const lesson_id = 1;
  const index = lesson_id - 1;

  React.useEffect(() => {
    fetch(`/lessons/${lesson_id}.json`)
        .then((response) => response.json())
        .then((data) => {
          setLesson(data.lesson[index]);
          setComps(data.lesson.slice(1,-1));
          })
  }, []); 

  // These features of a lesson can be edited. Handle separately.
  React.useEffect(() => {
    setTitle(lesson.title);
    setLessonPic(lesson.imgUrl);
  });

  const author = lesson.author;


  const compCards = [];

  for (const comp of comps) {
    compCards.push(
      <CompTemplate
        key={comp.component}
        title={comp.component}
        img={comp.c_img}
        link={comp.c_link}
      />
    );
  }

  return (
    <React.Fragment>
      <img src={lessonPic}></img>
      <h2>{`${title} by ${author}`}</h2>
      <div>{compCards}</div>
      <button id="newPic">Change lesson pic?</button>
    </React.Fragment>
  );
}


ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('task'));