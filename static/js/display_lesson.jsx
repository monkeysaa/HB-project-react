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
  

function ShowLesson(props) {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState([]);
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState([]);
    const lesson_id = props.lesson_id;
    const index = lesson_id - 1;
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            setLesson(data.lesson[index]);
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    // These features of a lesson can be edited. Handle separately.
    React.useEffect(() => {
      setTitle(lesson.title);
      setLessonPic(lesson.imgUrl);
    });
  
    const author = lesson.author;
  
  
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
  
    return (
      <section className="lesson">
        <img src={lessonPic}></img>
        <h2>{`${title} by ${author}`}</h2>
        <div>{compCards}</div>
        <button id="newPic">Change lesson pic?</button>
      </section>
    );
  }