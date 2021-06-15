function MultiLessonDisplay({lessons}) {
    // const lessons = matches; 
    // console.log(lessons);
  
    const lessonCards = [];
    
    for (const lesson of lessons) {
      if (lesson.imgUrl == null) {
          lesson.imgUrl = "/static/img/placeholder.png"
      }
      
      lessonCards.push(
        <LessonCard
          key={lesson.lesson_id}
          id={lesson.lesson_id}
          title={lesson.title}
          author={lesson.author}
          img={lesson.imgUrl}
          overview = {lesson.overview}
        />
      );
    }
    
    return (
      <section>{lessonCards}</section>
    );
  }
  
  
  function LessonCard(props) {
    const history = ReactRouterDOM.useHistory();
  
    // takes props: id, title, overview, img, author)
    function showLesson()  {
      history.push(`/api/lesson/${props.id}.json`);
    }
  
    return (
      <article className="lesson-card">
        {/* TODO: Decide which header level (<h2> <h3> etc */}
        <h2><a href={`/lesson/${props.id}`}> {props.title} </a> </h2> 
        <p> {props.overview} </p>
        <a href={`/lesson/${props.id}`}><img src={props.img}/></a>
        <p> {props.author}</p>
        {/* <p> {props.tags} </p> */}
        <button className="card_btn" onSubmit={showLesson}>View Lesson</button>
      </article>
    );
  }