'use strict';

function Home() {
  const history = ReactRouterDOM.useHistory();
  const [lessons, setLessons] = React.useState([]);
  const [handle, setHandle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  const get_demo_lessons = () => {

    fetch('/api/lessons')
    .then(response => response.json())
    .then(res => {
        setLessons(res.lessons.slice(0, 5));
    })

  }

  React.useEffect(() => {
    get_demo_lessons();
  }, [])
  
  const handleSignup = (e) => {
    e.preventDefault();

    const user = {"handle": handle, "email": email, "password": pass};
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
          'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success == false) {
          alert('Email is already in use. Try again.');
      } else if (data.success === true) {
          alert('User created successfully!');
          history.push(`/profile`);
      } else {
          alert('Something done broke');
      }
    })
  }

  return (
    <React.Fragment>
      <header><h2>DESK</h2></header>
      <div id='landing-search-div'>
        <h2>Explore Lessons!</h2>
        <Searchbar />
      </div>
      <section id='lesson-samples'>
        <MultiLessonDisplay lessons={lessons} />
      </section>
      <section id='signup-greeting'>
        <h2>Sign up to create or save your next lesson!</h2>
        <form id='signup'>
          <h2>Welcome to DESK!</h2>
          <input id='email' placeholder='Email' />
          <input id='handle' placeholder='Username' />
          <input id='password' placeholder='Password' type='password' />
          <p id='welcome-footnote'>Already a user?</p>
          <button type='button' id='signin-btn'>Sign In</button>
          <button type='button' id='signup-btn'>Sign Up</button>
        </form>
      </section>
    </React.Fragment>
  );
}





