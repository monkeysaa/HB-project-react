// Build Lesson template
// Load show lesson card template 

"use strict";

function LessonTemplate(props) {

    return (
      <div className="lesson">
        <p> {props.title} </p>
        <p> {props.description} </p>
        <img src={props.img} />
      </div>
    );
  }
  

function Profile() {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [lessons, setLessons] = React.useState([]);
    // const [lessonPic, setLessonPic] = React.useState([]);
    // const lesson_id = 1;
    // const index = lesson_id - 1;
  
    React.useEffect(() => {
      fetch('/api/profile.json')
          .then((response) => response.json())
          .then((data) => {
            setUsername(data.user.username);
            setEmail(data.user.email);
            setLessons(data.user.lessons);
            })
    }, []); 
  
    // Link to Create a Lesson
    // Display favorites? 
    // Each Lesson can be edited. Link to Edit-Lesson

  
    const lessonCards = [];
  
    for (const lesson of lessons) {

      if (lesson.imgUrl == null) {
          lesson.imgUrl = "/static/img/placeholder.png"
      }
      
      lessonCards.push(
        <LessonTemplate
          key={lesson.lesson_id}
          title={lesson.title}
          img={lesson.imgUrl}
          description = {lesson.description}
        />
      );
    }
  
    return (
      <React.Fragment>
        <h2>{`${username} at ${email}`}</h2>
        <div>{lessonCards}</div>
      </React.Fragment>
    );
  }