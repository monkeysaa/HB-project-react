"use strict";

function CompTemplate(props) {
    return (
      <div className="component">
        <p> {props.title} </p>
        <img src={props.img} />
        <a href={`${props.link}`}> </a>
      </div>
    );
  }

function ShowSingleLesson() {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState('');
    const [overview, setOverview] = React.useState('');

    // If I want this to be props rather than a state var, how/where do I set that up? 
    const [author, setAuthor] = React.useState('')


    let { lesson_id } = useParams();
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            setLesson(data.lesson[0]);
            setAuthor(data.lesson[0].author);
            setTitle(data.lesson[0].title);
            setLessonPic(data.lesson[0].imgUrl);
            setOverview(data.lesson[0].overview);
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    const compCards = [];
  
    for (const comp of comps) {
      compCards.push(
        <CompTemplate
          key={comp.component}
          title={comp.component}
          img={comp.c_img}
          link={comp.c_link}
        />
      );
    }

    function editLesson() {
      window.location.href = `/lesson/${lesson_id}/edit`;
    }

    return (
      <section className="lesson">
        <div>
          <h3>Lesson ID: {lesson_id}</h3>
          <button onClick={editLesson}>Edit Lesson</button>
        </div>
        <img src={lessonPic}></img>
        <h2>{`${title} by ${author}`}</h2>
        <h3>{overview}</h3>
        <div>{compCards}</div>
      </section>
    );
  }