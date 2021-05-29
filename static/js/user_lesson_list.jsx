function Lesson(props) {
    return (
      <ul>
        <li> {props.title} </li>
      </ul>
    )
  }
  
  function User(props) {
    // console.log(props.lessons);
  
    return (
      <ul>
        <li>
          {props.handle}: {props.email} <br/>
          {props.lessons} 
        </li>
      </ul>
    )
  }
  
  function UserLessonList(props) {
    const [allUserList, setAllUserList] = React.useState([])
  
    React.useEffect(() => {
      fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        const userList = [];
        for (const u of data) {
          const lessons = [];
          for (const l of u.lessons) {
            lessons.push(<Lesson key={l.lesson_id} title={l.title}/>);
          }
          userList.push(<User key={u.user_id} handle={u.handle} email={u.email} lessons={lessons}/>);
        }
        console.log(userList);
        setAllUserList(userList);
      })
    }, [])
  
    return(
      <ul>
        {allUserList}
      </ul>
    )
  }