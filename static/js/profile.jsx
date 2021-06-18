"use strict";
// Page will:
    // Display user info
    // Call MultiLessonDisplay to display user's lessons
        // LessonCard: Displays each lesson
        // LessonTemplate: Template for each lesson card
    // TODO: Display favorite lessons

  
function ProfilePic({profilePic, addPic}) {
  const history = ReactRouterDOM.useHistory();
  const [file, setFile] = React.useState(null);
  const loggedIn = document.getElementById('login_state')

  if (loggedIn.data-loggedin === false) {
    history.push(`/login`);
  }

  return(
    <React.Fragment>
      <img id="profile-img" src={profilePic}/>
      <p> Add or change your profile pic: 
        <input 
          id = 'profile-pic' 
          type='file' 
          name='profile-pic' 
          onChange={(event) => setFile(event.target.files[0])}/>
        <button id='add-profile-pic' type='button' 
            onClick={() => {addPic(file)} }>
            <i className="fa fa-plus"/>
        </button>
      </p>
    </React.Fragment>
  );
}

function Profile() {
  const history = ReactRouterDOM.useHistory();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lessons, setLessons] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState('');

  console.log('WE ARE HERE! Line 16 of profile.jsx!')

  React.useEffect(() => {
    fetch('/api/users/user/')
    .then((response) => response.json())
    .then((data) => {
      // should display user and lesson data from serverside display_profile()
      setUsername(data.user.handle);
      setEmail(data.user.email);
      // TODO: Make sure /api/users/user' returns user.profile_pic w/ other data
      setProfilePic(data.user.profile_pic);
      setLessons(data.lessons);
    })
  }, []); 

  function createLesson() {
      history.push(`/create_lesson`);
  }

  // TODO: Hide "View Lesson" button on this page
  // TODO: Display favorites? 


  // Later, update this to updateProfile with functionality for changing all user settings.

  const addPic = (file) => {
    console.log(file);
    const formData  = new FormData();
    const pic = document.getElementById('profile-pic').files[0];

    // formData.append('username', username);
    // formData.append('email', email);
    // formData.append('password', password);
    formData.append('profile-pic', pic);
    
    fetch('/api/users/user', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(res => {
      // if (res.success === false) {
      //   alert('something done broke.');
      // } else if (res.success === true) {
      console.log(res);
      setUsername(res.user.username);
      setEmail(res.user.email);
      // TODO: Make sure /api/users/user' returns user.profile_pic w/ other data
      // TODO Make sure it returns the kind of data we need. 
      setProfilePic(res.user.profile_pic);
      setLessons(res.user.lessons);
      // <Alert key='successful-lesson' variant='success'>
      //   Profile updated successfully!
      // </Alert>
    })
  };
  
 
  
  return (
    <div className='Profile'>
      <section className='user-info'>
        <h2>{`${username} at ${email}`}</h2>
        <ProfilePic addPic={addPic} profilePic={profilePic} />
      </section>
      <section id='user-profile-lessons' className='lesson-samples'>
        <h2> Your Lessons </h2>
        <button onClick={createLesson}> Create New Lesson </button>

        <MultiLessonDisplay lessons={lessons}/> 
      </section>
    </div>
  );
}