'use strict';


function Nav({showNav}) {
  const history = ReactRouterDOM.useHistory();

  function processLogout() {
    console.log('processing Logout...')
    fetch('/api/session')
    .then(response => response.json())
    .then(data => {
      if (data.success === true) {
        document.getElementById('login_state').setAttribute('data-loggedin', 'False');
        console.log('user now logged out')
        history.push(`/login`);
      }
      else {
        alert('Server error. Did not process logout correctly.')
      }
    })
  }

  if ( showNav === false ) {
    return (
      <React.Fragment>
        <header>
          <img src='/static/img/desk-trans.png/'/>
          <h1>DESK</h1>
          <Link to="/profile"><i className="fa fa-user-circle"></i> </Link> 
        </header>
      </React.Fragment>


    );
  }
  else if (showNav === true) {

  }
  return (
    <React.Fragment>    
        <nav>
          <Link to="/"><i className="fa fa-home"/> </Link>
      {/* TODO: On Profile page, authenticate that user is logged in before displaying. */}
          <Link to="/profile">
            <i className="fa fa-user-circle" alt="Profile"></i> Profile
          </Link>
          <Link to="/directory">Lesson Directory</Link>
      {/* TODO: Hoist into JS and replace with {searchbar} for readability */}
          <Searchbar />
          <Link to="/create_lesson">Create Lesson</Link>
          <Link to="/logout" onClick={processLogout}>Log Out</Link>
        </nav>
    </React.Fragment>
  );
}

