"use strict";

function ShowSingleLesson() {
  const [title, setTitle] = React.useState('');
  const [comps, setComps] = React.useState([]);
  const [lessonPic, setLessonPic] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [author, setAuthor] = React.useState('');

  let { lesson_id } = useParams();

  React.useEffect(() => {

    fetch(`/api/lessons/${lesson_id}.json`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAuthor(data.lesson[0].author);
        setTitle(data.lesson[0].title);
        setLessonPic(data.lesson[0].imgUrl);
        setOverview(data.lesson[0].overview);
        setComps(data.comps);
      }
    )
  }, []); 

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
      <CompContainer comps={comps}/>
    </section>
  );
}