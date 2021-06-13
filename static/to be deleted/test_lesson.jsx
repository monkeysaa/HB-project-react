"use strict";  

function DisplayTestLesson() {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState([]);
    const [comps, setComps] = React.useState([]);
    const [author, setAuthor] = React.useState('');
    const [lessonPic, setLessonPic] = React.useState([]);
    const lesson_id = 4;
    const index = 0;
  
    console.log(comps);
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setLesson(data.lesson[0]);
            setComps(data.lesson.slice(1,-1));
            setTitle(data.lesson[0].title);
            setLessonPic(data.lesson[0].imgUrl);
            setAuthor(data.lesson[0].author)
            })
    }, []); 
  
    const compCards = [];
  
    for (const comp of comps) {
      console.log(comp);
      compCards.push(
        <CompCard
          key={comp.id}
          title={comp.id}
          img={comp.imgUrl}
          url={comp.url}
        />
      );
    }
  
    return (
      <section className="lesson">
        <img src={lessonPic}></img>
        {/* <h2>{`${title} by ${author}`}</h2> */}
        <div className='components'>{compCards}
        </div>
        <button id="newPic">Change lesson pic?</button>
      </section>
    );
  }
