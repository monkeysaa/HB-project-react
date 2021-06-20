'use strict';


function Nav({showNav, setShowNav}) {
  const history = ReactRouterDOM.useHistory();
  const [click, setClick] = React.useState(false);
  
  const handleClick = () => setClick(!click);

  function processLogout() {
    console.log('processing Logout...')
    fetch('/api/session')
    .then(response => response.json())
    .then(data => {
      if (data.success === true) {
          window.sessionStorage.loggedIn = false;
          setShowNav(false);
          console.log('sessionStorage.loggedIn = false');
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
        </header>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>    
        <nav>
          <Link to="/directory">Lesson Directory</Link>
          <Link to="/create_lesson">Create Lesson</Link>
          <Link to="/"><img src='/static/img/desk-trans.png'/> </Link>
          <Searchbar />
          {/* TODO: Fold profile and logout into a single drop-down from user-image  */}
          {/* <div className='profile-icon' on Click={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
          </div> */}
          <Link to="/profile">            
            <i className="fa fa-user-circle" alt="User info: Profile and Login"></i>
             Profile
          </Link>
          <Link to="/logout" onClick={processLogout}>Log Out</Link>
        </nav>
    </React.Fragment>
  );
}

