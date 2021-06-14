// fully controlled login form
function Login(props) {
    // const [errorMessage, setErrorMessage] = React.useState(null);
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loggedIn, setLoggedIn] = React.useState(false)
  
    const handleLogin = (evt) => {
      evt.preventDefault();
  
      const data = {"email": email, "password": password}
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
            document.getElementById('login_state').dataset.loggedin = true;
            console.log('User logged in. NOW redirect to profile')
            history.push(`/profile`);
            // window.location.href = '/profile';
          } else {
              alert(res);
              console.log(res);
            // setErrorMessage(res);
          }
        })
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
                onChange={(e) => setPassword(e.target.value)}
                value={password} 
              />
              <button onClick={handleLogin}> Log In </button>
            </form>
            <h2>Or Sign Up</h2>
            <CreateNewUser />
        </React.Fragment>
      );
  }


  
