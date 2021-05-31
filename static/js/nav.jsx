// FONT AWESOME NAVBAR IMAGES
{/* <i class="fa fa-home"></i>
<i class="fa fa-search"></i>
<i class="fa fa-user-circle"></i>
<i class="fa fa-user"></i>
<i class="fa fa-lock"></i> */}

function Nav() {

  function processLogout() {
    console.log('processing Logout...')
    fetch('/api/logout')
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            window.location.href = '/';
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
          <Link to="/profile"><i className="fa fa-user-circle" alt="Profile"></i> Profile</Link>
          <Link to="/users">Users and Lessons</Link>
          <Link to="/lesson">Test Lesson</Link>
          <form>
            <input type="text" id="search" placeholder="Search here..."/>
            <button type="button"><i className="fa fa-search"></i></button>
          </form>
          <Link to="/login"><i className="fa fa-user-circle"></i> Login</Link>
          <Link to="/create_lesson">Create Lesson</Link>
          <Link to="/logout" onClick={processLogout}>Log Out</Link>
        </nav>
      </React.Fragment>
    );
}
  