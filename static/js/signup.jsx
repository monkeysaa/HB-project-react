function CreateNewUser({greeting}) {
  
  const history = ReactRouterDOM.useHistory();

  // {"handle": "AliC", "email": "ali@gmail.com", "password": "test"}
  const [handle, setHandle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

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
      console.log(`Data test PHIL: ${data}, ${typeof(data)}`);
      console.log(typeof(data.success));
      if (data.success == false) {
        <Alert variant='warning'>
        Email already in use. Please try again or click log in if you already have an account.
      </Alert>
      } else if (data.success === true) {
        <Alert variant='Success'>
          User created successfully;
      </Alert>

          history.push(`/profile`);
          // window.location.href = '/profile';
      } else {
          alert('Something done broke');
      }
    })
  }

  function handleLogin() {
    history.push(`/login`);
  }
  
  return (
    <React.Fragment>
        <form id='signup'>
          <h2>{greeting}</h2>
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
          <p id='welcome-footnote'>Already a user?</p>
          <div className='greeting-btns'>
            <button type='button' id='secondary-btn' onClick={handleLogin}>Sign In</button>
            <button type='button' id='primary-btn' onClick={handleSignup}>Sign Up</button>
          </div>
        </form>
    </React.Fragment>
  );
}
  