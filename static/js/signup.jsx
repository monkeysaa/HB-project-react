function CreateNewUser(props) {
  
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
      if (data.success == false) {
          alert('Email is already in use. Try again.');
      } else if (data.success === true) {
          alert('User created successfully!');
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
      <section id='greeting signup'>
        <h2>Sign up to create or save your next lesson!</h2>
        <form id='signup'>
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
          <p id='welcome-footnote'>Already a user?</p>
          <button type='button' id='signin-btn' onClick={handleLogin}>Sign In</button>
          <button type='button' id='signup-btn' onClick={handleSignup}>Sign Up</button>
        </form>
      </section>
  );
}
  