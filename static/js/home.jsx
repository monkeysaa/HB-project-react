'use strict';

function Home() {
  const history = ReactRouterDOM.useHistory();
  const [lessons, setLessons] = React.useState([]);

  const get_demo_lessons = () => {
    // fetch call to server
    // get all lessons
    // save first 5 to "lessons"

    fetch('/api/lessons')
    .then(response => response.json())
    .then(res => {
        setLessons(res.lessons.slice(0, 4));
    })

  }

  React.useEffect(() => {
    get_demo_lessons();
  }, [])
  
  return (
    <React.Fragment>
      <header><h1>DESK!</h1></header>

      <div id='landing-search-div'>
        <h2>Explore Lessons!</h2>
        <Searchbar />
      </div>
      <section id='lesson-samples'>
        <MultiLessonDisplay lessons={lessons} />
      </section>
    </React.Fragment>
  );
}