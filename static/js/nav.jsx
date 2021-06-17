
function Nav() {
  const history = ReactRouterDOM.useHistory();

  function processLogout() {
    console.log('processing Logout...')
    fetch('/api/session')
    .then(response => response.json())
    .then(data => {
      if (data.success == true) {
        history.push(`/login`);
      }
      else {
        alert('Server error. Did not process logout correctly.')
      }
    })
  }

  return (
    <React.Fragment>
      <nav>
        <Link to="/"><img src="/static/img/home.png" alt="Home"/></Link>
        {/* TODO: This link doesn't push page properly. INVESTIGATE. */}
        <Link to="/profile"><i className="fa fa-user-circle" alt="Profile"></i> Profile</Link>
        <Link to="/users">Lesson Directory</Link>
        {/* TODO: Hoist into above JS and replace with {searchbar} for readability */}
        <Searchbar />
        <Link to="/login"><i className="fa fa-user-circle"></i> Login</Link>
        <Link to="/create_lesson">Create Lesson</Link>
        <Link to="/logout" onClick={processLogout}>Log Out</Link>
      </nav>
    </React.Fragment>
  );
}