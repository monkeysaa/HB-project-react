function Lesson(props) {
    return (
      <ul>
        <Link to={`/lesson/${props.lesson_id}`}>{props.title}</Link>
      </ul>
    )
  }
  
  function User(props) {
  
    return (
      <ul>
        <li>
          {props.handle}: {props.email} <br/>
          {props.lessons} 
        </li>
      </ul>
    )
  }
  
  function Directory(props) {
    const [allUserList, setAllUserList] = React.useState([])
  
    React.useEffect(() => {
      fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        const userList = [];
        for (const u of data) {
          const lessons = [];
          for (const l of u.lessons) {
            lessons.push(<Lesson key={l.lesson_id} title={l.title} lesson_id={l.lesson_id}/>);
          }
          userList.push(<User key={u.user_id} handle={u.handle} email={u.email} lessons={lessons}/>);
        }
        setAllUserList(userList);
      })
    }, [])
  
    return(
      <React.Fragment>
        <h2>Directory</h2>
        <ul>
          {allUserList}
        </ul>
      </React.Fragment>
    )
  }