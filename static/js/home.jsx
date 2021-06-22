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
        <Alert variant='warning'>
        Email already in use. Please try again or click log in if you already have an account.
      </Alert>
      } else if (data.success === true) {
        <Alert variant='success'>
          You are now logged in!
        </Alert>          
      history.push(`/profile`);
      } else {
          alert('Something done broke');
      }
    })
  }; 

  function handleLogin() {
    history.push(`/login`);
  }

  return (
    <React.Fragment>
      <div id='landing-search-div'>
        <h2>Explore Lessons!</h2>
        <Searchbar />
      </div>
      <section className='lesson-samples'>
        <MultiLessonDisplay lessons={lessons} />
      </section>
      <section id='landing-signup'>
        <h2>Sign up to create or save your next lesson!</h2>
        <CreateNewUser greeting='Welcome to DESK!'/>
      </section>
    </React.Fragment>
  );
}



      {/* <section id='signup-greeting'>
        <h2>Sign up to create or save your next lesson!</h2>
        <form id='landing-signup'>
          <h2>Welcome to DESK!</h2>
          <input 
            type="text" 
            placeholder='Username'
            onChange={(e) => setHandle(e.target.value)}
            value={handle} 
          />
          <input 
            type="text" 
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email} 
          />
          <input 
            type="text" 
            placeholder='Password'
            onChange={(e) => setPass(e.target.value)}
            value={pass} 
          />
          <p id='welcome-footnote'>
            Already a user?</p>
          <div className='greeting-btns'>
          <button type='button' id='secondary-btn' onClick={handleLogin}>Sign In</button>
            <button type='button' id='primary-btn' onClick={handleSignup}>Sign Up</button>
          </div>
        </form>
      </section> */}

