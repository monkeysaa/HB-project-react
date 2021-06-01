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
    const [author, setAuthor] = React.useState('')


    let { lesson_id } = useParams();
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            setLesson(data.lesson[0]);
            setAuthor(data.lesson[0].author);
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    // These features of a lesson can be edited. Handle separately.
    React.useEffect(() => {
      setTitle(lesson.title);
      setLessonPic(lesson.imgUrl);
    //   Add comps here, since they can be edited
    }, []); // What should I put in the brackets: title & lessonPic
    // all inputs have an onchange that calls a function
    // set state variable in root 
    // update that state variable, and it updates everythign else
    // I don't have to have a set-title thing, just have the title of the page be a state variable and it'll know to update them automatically. 
    // title squiggle state.title
  
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
        <div>{compCards}</div>
        <button id="newPic">Change lesson pic?</button>
      </section>
    );
  }