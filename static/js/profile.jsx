"use strict";
// Page will:
    // Display user info
    // Call MultiLessonDisplay to display user's lessons
        // LessonCard: Displays each lesson
        // LessonTemplate: Template for each lesson card
    // TODO: Display favorite lessons

function Profile() {
  const history = ReactRouterDOM.useHistory();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lessons, setLessons] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState('');


  React.useEffect(() => {
    fetch('/api/users/user/')
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.user.username);
        setEmail(data.user.email);
        // TODO: Make sure /api/users/user' returns user.profile_pic w/ other data
        setProfilePic(data.user.profile_pic);
        setLessons(data.user.lessons);
      })
  }, []); 

  function createLesson() {
      history.push(`/create_lesson`);
  }

  // TODO: Hide "View Lesson" button on this page
  // TODO: Display favorites? 


  const updateProfile = () => {
    // formData.append('username', username);
    // formData.append('email', email);
    // formData.append('password', password);
    formData.append('profile-pic', file);
    fetch('/api/users/user'), {
      method: 'POST',
      body: formData,
    }
    .then(response => response.json())
    .then(res => {
      if (res.success === false) {
        alert('something done broke.');
      } else if (res.success == true) {
        setUsername(res.user.username);
        setEmail(res.user.email);
        // TODO: Make sure /api/users/user' returns user.profile_pic w/ other data
        // TODO Make sure it returns the kind of data we need. 
        setProfilePic(res.user.profile_pic);
        setLessons(res.user.lessons);
        <Alert key='successful-lesson' variant='success'>
          Lesson {res.lesson_id} created successfully!
        </Alert>
      }
    })
  };
  
 
  
  return (
    <React.Fragment>
      <h2>{`${username} at ${email}`}</h2>
      <ProfilePic setProfilePic={setProfilePic}/>

      <button onClick={createLesson}> Create New Lesson </button>
      <MultiLessonDisplay lessons={lessons}/>
    </React.Fragment>
  );
}

function ProfilePic({setProfilePic}) {

  const addPic = () => {


  return(
    <img src={profilePic}/>
    <button onClick={addPic}>Add or change your profile pic</button>
    <input 
      id = 'profile-pic' type='file' name='profile-pic' />
  );
}



