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
      history.push(`/create_lesson`);
    // window.location.href = '/create_lesson';
    
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



