"use strict";
// Page will:
    // Display user info
    // Call MultiLessonDisplay to display user's lessons
        // LessonCard: Displays each lesson
        // LessonTemplate: Template for each lesson card
    // TODO: Display favorite lessons

function Profile() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lessons, setLessons] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/users/user')
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.user.username);
        setEmail(data.user.email);
        setLessons(data.user.lessons);
      })
  }, []); 

  function createLesson() {
    window.location.href = '/create_lesson';
  }
  // TODO: Hide "View Lesson" button on this page
  // TODO: Display favorites? 
  
  return (
    <React.Fragment>
      <h2>{`${username} at ${email}`}</h2>
      <button onClick={createLesson}> Create New Lesson </button>
      <MultiLessonDisplay lessons={lessons}/>
    </React.Fragment>
  );
}


function MultiLessonDisplay({lessons}) {
  // const lessons = matches; 
  console.log(lessons);

  const lessonCards = [];
  
  for (const lesson of lessons) {
    if (lesson.imgUrl == null) {
        lesson.imgUrl = "/static/img/placeholder.png"
    }
    
    lessonCards.push(
      <LessonCard
        key={lesson.lesson_id}
        id={lesson.lesson_id}
        title={lesson.title}
        author={lesson.author}
        img={lesson.imgUrl}
        description = {lesson.description}
      />
    );
  }
  
  return (
    <section>{lessonCards}</section>
  );
}


function LessonCard(props) {
  function showLesson()  {
    history.push(`/api/lesson/${props.id}.json`);
  }

  return (
    <article className="lesson-card">
      {/* TODO: Decide which header level (<h2> <h3> etc */}
      <h2><a href={`/lesson/${props.id}`}> {props.title} </a> </h2> 
      <p> {props.description} </p>
      <a href={`/lesson/${props.id}`}><img src={props.img}/></a>
      <p> {props.author}</p>
      {/* <p> {props.tags} </p> */}
      <button className="card_btn" onSubmit={showLesson}>View Lesson</button>
    </article>
  );
}
