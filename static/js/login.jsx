function Login(props) {
  // const [errorMessage, setErrorMessage] = React.useState(null);
  const [email, setEmail] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [loggedIn, setLoggedIn] = React.useState(false)
  // could do with fetch & check cookies
  // create a variable that would fetch info about session
  

  const handleLogin = (e) => {
    e.preventDefault();

    const user = {"email": email, "password": pass}
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(res => {
        if (res === 'success') {
          setLoggedIn(true);
          document.getElementById('login_state').dataset.loggedin = true;
          console.log('User logged in. Now redirect to profile')
          // update loggedIn with useState
          // worst case: reload right here. 
        } else {
          console.log(res)
          // setErrorMessage(res);
        }
      })
      // .then(test => {
      //   console.log(loggedIn);
      //   if (loggedIn === true) {
      //     console.log('Now redirect to profile.');
      //   }
      // })
    }
      
    return (
      <React.Fragment>
          {/* {errorMessage ? <ErrorMessage errorMessage={errorMessage} />: null} */}
          <h2>Login</h2>
          <form> 
            Email: 
            <input 
              type="text" 
              onChange={(e) => setEmail(e.target.value)}
              value={email} 
            />
            Password:
            <input 
              type="text" 
              onChange={(e) => setPass(e.target.value)}
              value={pass} 
            />
            <button onClick={handleLogin}> Log In </button>
          </form>
      
      </React.Fragment>
    );
}