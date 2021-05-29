function CreateNewUser(props) {
    // {"handle": "AliC", "email": "ali@gmail.com", "password": "test"}
    const [handle, setHandle] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
  
    const makeUser = (e) => {
      e.preventDefault();

      const user = {"handle": handle, "email": email, "password": pass}
      fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
        if (data === 'nope') {
            alert('Email is already in use. Try again.');
        } else if (data === 'yep') {
            alert('User created successfully!');
            // Redirect to Profile Page
        } else {
            alert('Something done broke');
        }
        })
    }
  
    return (
      // if it's a form, need to prevent default... necessary if no form action?
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
  