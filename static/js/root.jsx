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

function CompTemplate(props) {
  return (
    <div className="component">
      <p> {props.title} </p>
      <img src={props.img} />
      <a href={`${props.link}`}> </a>
    </div>
  );
}

function Smile() {
  const [title, setTitle] = React.useState([]);
  const [author, setAuthor] = React.useState([]);
  const [comps, setComps] = React.useState([]);

  React.useEffect(() => {
    fetch("/lessons/1.json")
        .then((response) => response.json())
        .then((data) => {
          setAuthor(data.lesson[0].author);
          setTitle(data.lesson[0].title);
          setComps(data.lesson.slice(1,-1));
          })
  }, []); 

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
      <img src="/static/img/high5.jpg"></img>
      <h2>{`${title} by ${author}`}</h2>
      <div>{compCards}</div>
    </React.Fragment>
  );
}


ReactDOM.render(
  <Router>
    <Controller />
  </Router>,
  document.getElementById('task'));