"use strict";

// Eventually, this goes at the top of your single-page. 
const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;


function Task() {
  // return statement must return a single element (e.g. div or React Fragment)
  return (
    <React.Fragment>
      <p>Current task: Link to individual lessons!</p>
    </React.Fragment>
  );
}

function LessonTemplate(props) {
  return (
    <div className="lesson">
      <p> Lesson Title: {props.title} </p>
      <img src={props.imgUrl} />
      <p> Author: {props.author} </p>
    </div>
  );
}

function LessonController() {
  return (
    <div>
      <Link to="/lesson/1">About</Link>
    <Switch>
      <Route path="/lessons"> 
        <LessonContainer>
        </LessonContainer>
      </Route>
    <Route path="/lesson/:id"> 
      <SingleLesson></SingleLesson>
    </Route>
</Switch>
</div>
  );
}

function SingleLesson() {
  // const params = useParams();
  // params.id
  return(
    <div>
    <Link to="/lessons">All Lessons</Link>
    </div>
  );
}

function LessonContainer() {
  const [lessons, setLessons] = React.useState([]);

  React.useEffect(() => {
    fetch("/lessons.json")
      .then((response) => response.json())
      .then((data) => setLessons(data.lessons));
  }, []);

  const lessonCards = [];

  for (const lesson of lessons) {
    lessonCards.push(
      <LessonTemplate
        key={lesson.lesson_id}
        title={lesson.title}
        author={lesson.author}
        imgUrl={lesson.imgUrl}
      />
    );
  }

  return (
    <React.Fragment>
      <h2>Lessons</h2>
      <div>{lessonCards}</div>
    </React.Fragment>
  );
}



ReactDOM.render(<Task />, document.getElementById('task'));
ReactDOM.render(
  <Router>
    <LessonController />
  </Router>,
  document.getElementById('testing'));

