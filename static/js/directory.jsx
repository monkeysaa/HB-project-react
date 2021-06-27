
  
function User(props) {
  
  return (
    <ul className='lessons-directory-carousel'>
      <li>
        <img src={props.profile_pic}/> {props.handle}:
        <section className='lesson-samples'>
          <MultiLessonDisplay lessons={props.lessons} />
        </section>
      </li>
    </ul>
  )
}
  
function Directory(props) {
  const [allUserList, setAllUserList] = React.useState([]);
  const [allLessonList, setAllLessonList] = React.useState([]);

  React.useState(() => {
    fetch('/api/users')
    .then(response => response.json())
    .then(data => {
      const userList = [];
      for (const u of data.users) {
        userList.push(<User key={u.id} profile_pic = {u.profile_pic} handle={u.handle} email={u.email} lessons={u.lessons}/>);
      }
      setAllUserList(userList);
    })
  }, []);



  return(
    <React.Fragment>
      <h2>Directory</h2>
      {allUserList}
    </React.Fragment>
  )
}

// Final Markup structure: 
//<React.Fragment>
{/* <h2>Directory</h2>
    <ul className='lessons-directory-carousel'>
      <li>
        {props.handle}: <br/>
        <section className='lesson-samples'>
          <MultiLessonDisplay lessons={props.lessons} />
        </section>
      </li>
    </ul>
    <ul className='lessons-directory-carousel'>
      <li>
        {props.handle}: <br/>
        <section className='lesson-samples'>
          <MultiLessonDisplay lessons={props.lessons} />
        </section>
      </li>
    </ul>
  </ul>
  </React.Fragment> */}
