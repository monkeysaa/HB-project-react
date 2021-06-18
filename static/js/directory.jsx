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
        {props.handle}: <br/>
        {/* Decide whether to display narrow or wide */}
        <MultiLessonDisplay lessons={props.lessons}/>
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
      // const userList = [];
      // for (const u of data.users){
      //   userList.push(<User key={u.id} handle={u.handle} email={u.email} lessons={u.lessons}/>);
      // }
      // setAllUserList(userList);
      const userList = [];
      for (const u of data.users) {
        console.log(u.lessons);
        const lessonsHTML = [];
        // lessonsHTML.push(
        //   // <MultiLessonDisplay lessons={u.lessons}/>
        // )
        userList.push(<User key={u.id} handle={u.handle} email={u.email} lessons={u.lessons}/>);
      }
      setAllUserList(userList);
    })
  }, []);



  return(
    <React.Fragment>
      <h2>Directory</h2>
      <ul>
        {allUserList}
        {/* {lessonsHTML} */}
      </ul>
    </React.Fragment>
  )
}