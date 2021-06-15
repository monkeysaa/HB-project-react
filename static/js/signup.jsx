function CreateNewUser(props) {
  
  const history = ReactRouterDOM.useHistory();

  // {"handle": "AliC", "email": "ali@gmail.com", "password": "test"}
  const [handle, setHandle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  
  const makeUser = (e) => {
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
  
  return (
    <form> 
      Username: 
      <input 
        type="text" 
        onChange={(e) => setHandle(e.target.value)}
        value={handle} 
      />
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
      <button onClick={makeUser}> Sign Up </button>
    </form>
  )
}
  