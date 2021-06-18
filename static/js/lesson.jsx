const Img = ReactBootstrap.Image;
const {Container, Button, ButtonGroup, Navbar, Form, NavDropdown, Nav, Media, 
Row, Col, Modal, Alert, Toast, Card, Spinner, LinkButton} = ReactBootstrap;

function MultiLessonDisplay({lessons, spec='wide', userPic=null}) {
    // const lessons = matches; 
    console.log(lessons);
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
        spec={spec}
      />
    );
  }
    
  return (
    <React.Fragment>
      {lessonCards}
    </React.Fragment>
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
      // NO CSS STYLING

      // <article className="lesson-card">
      //   {/* TODO: Decide which header level (<h2> <h3> etc */}
      //   <p className="favorite-pin">♡</p>
      //   <h2><a href={`/lessons/${props.id}`}> {props.title} </a> </h2> 
      //   <p> {props.overview} </p> 
      //   <a href={`/lessons/${props.id}`}><img src={props.img}/></a>
      //   <p> {props.author}</p>
      //   {subjectTags && <p>Subjects: {subjectTags.join(', ')} </p>}
      //   {gradeTags && <p>Grades: {gradeTags.join(', ')} </p>}
      //   <button className="card_btn" onSubmit={showLesson}>View Lesson</button>
      // </article>

      // CSS STYLING
      <article className={`lesson-card ${props.spec}`}>
        <h3><a href={`/lessons/${props.id}`} > {props.title}  </a> </h3> 
        <a className="lesson-banner" href={`/lessons/${props.id}`}>
          <img src={props.img}/></a>
        {(props.author && props.spec === 'wide') && <p className='author'>{props.author}</p>}
        {(props.overview && props.spec === 'wide') && 
          <p className='overview'> {props.overview} </p>}
        {gradeTags && <p className='grades'>Grades: {gradeTags.join(', ')} </p>}
        {subjectTags && <p className='subjects'>Subjects: {subjectTags.join(', ')} </p>}
        <button className="favorite-pin">♡</button>
      </article>
    );
  }


function BootstrapCard(props) {
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
    // <article className="lesson-card brief">
    //   <h3><a href={`/lessons/${props.id}`} > {props.title}  </a> </h3> 
    //   <a className="lesson-banner" href={`/lessons/${props.id}`}>
    //     <img src={props.img}/></a>
    //   {gradeTags && <p>Grades: {gradeTags.join(', ')} </p>}
    //   {subjectTags && <p className='subjects'>Subjects: {subjectTags.join(', ')} </p>}
    //   <button className="favorite-pin">♡</button>
    // </article>

    <Card className='bootstrap-lesson-card' style={{ width: '18rem' }}>
      <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
        <Card.Img variant="top" src={props.img} className="img-fluid"/>
        <Card.Body>
          <a href={`/lessons/${props.id}`} ><Card.Title>{props.title}</Card.Title></a>
          <Card.Text>
            { gradeTags !=[] && (`Grades: ${gradeTags.join(', ')}` )} 
            {subjectTags !=[] && (`Subjects: ${subjectTags.join(', ')}` )}
            { !(gradeTags !=[] || subjectTags !=[] ) && props.overview }
          </Card.Text>
          <Button variant="primary" className="favorite-pin">♡</Button>
        </Card.Body>
      </div>
    </Card>


  );
}