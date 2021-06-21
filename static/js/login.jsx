// fully controlled login form


function Login({setShowNav}) {
  const history = ReactRouterDOM.useHistory();
  
  // const [errorMessage, setErrorMessage] = React.useState(null);
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loggedIn, setLoggedIn] = React.useState(false)

  const handleLogin = () => {
    if (email == '') {
      return (
        <Alert variant='warning'>
        Email field cannot be left blank.
      </Alert>
      );
    } else 
    if (password == '') {
      <Alert variant='warning'>
        Password field cannot be left blank.
      </Alert>
    } else {

      const data = {"email": email, "password": password};
      fetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(res => {
        if (res === 'success') {
          setLoggedIn(true);
          window.sessionStorage.loggedIn = true;
          setShowNav(true);
          history.push('/profile');

        } else {
          <Alert variant='warning'>
          Login unsuccesful.
          </Alert>
        }
      })
    }
  };

  function handleSignup() {
    history.push(`/signup`);
  }
      
  return (
    <React.Fragment>
      <section id='greeting login'>
        <form id='login-form'>
          <h2>Log in to create or save your next lesson!</h2>
          <input 
            type="text" 
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email} 
          />
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            value={password} 
          />
          <p id='welcome-footnote'>Need an account?</p>
          <div className='greeting-btns'>
            <button type='button' id='secondary-btn' onClick={handleSignup}>Sign Up</button>
            <button type='button' id='primary-btn' onClick={handleLogin}> Log In </button>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
}