function MultiLessonDisplay({lessons}) {
    // const lessons = matches; 
    // console.log(lessons);
    const lessonCards = [];
    
    for (const lesson of lessons) {
      if (lesson.imgUrl == null) {
          lesson.imgUrl = "/static/img/placeholder.png"
      }
      console.log(`${lesson.tags} from MultiLessonDisplay`)
      lessonCards.push(
        <LessonCard
          key={lesson.lesson_id}
          id={lesson.lesson_id}
          title={lesson.title}
          author={lesson.author}
          img={lesson.imgUrl}
          overview = {lesson.overview}
          tags={lesson.tags}
        />
      );
    }
    
    return (
      <section>{lessonCards}</section>
    );
  }
  
  
  function LessonCard(props) {
    const history = ReactRouterDOM.useHistory();

    console.log(`${props.tags} from LessonCard`)

    // takes props: id, title, overview, img, author)
    function showLesson()  {
      history.push(`/api/lesson/${props.id}.json`);
    }

    const subjectTags = [];
    const gradeTags = [];
    console.log(props.tags)
    for (const tag of props.tags) {
        if (tag.category === 'subjects') {
            subjectTags.push(tag.name)
        }
        else {
            gradeTags.push(tag.name)
        }
    }

  
    return (
      <article className="lesson-card">
        {/* TODO: Decide which header level (<h2> <h3> etc */}
        <h2><a href={`/lesson/${props.id}`}> {props.title} </a> </h2> 
        <p> {props.overview} </p>
        <a href={`/lesson/${props.id}`}><img src={props.img}/></a>
        <p> {props.author}</p>
        {subjectTags && <p>Subjects: {subjectTags.join(', ')} </p>}
        {gradeTags && <p>Grades: {gradeTags.join(', ')} </p>}
        <button className="card_btn" onSubmit={showLesson}>View Lesson</button>
      </article>
    );
  }