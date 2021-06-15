"use strict";

function SingleLesson() {
  const history = ReactRouterDOM.useHistory();
  const [title, setTitle] = React.useState('');
  const [comps, setComps] = React.useState([]);
  const [lessonPic, setLessonPic] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [tags, setTags] = React.useState([]);

  let { lesson_id } = useParams();

  React.useEffect(() => {

    fetch(`/api/lessons/${lesson_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.lesson.tags);
        setAuthor(data.lesson.author);
        setTitle(data.lesson.title);
        setLessonPic(data.lesson.imgUrl);
        setOverview(data.lesson.overview);
        setTags(data.lesson.tags);
        setComps(data.comps);
      }
    )
  }, []); 

  const subjectTags = [];
  const gradeTags = [];

  for (const tag of tags) {
      if (tag.category === 'subjects') {
          subjectTags.push(tag.name)
      }
      else {
          gradeTags.push(tag.name)
      }
  }

  function editLesson() {
    history.push(`/lessons/${lesson_id}/edit`);
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
      {(subjectTags.length != 0) && <p>Subjects: {subjectTags.join(', ')} </p>}
      {(gradeTags.length != 0) && <p>Grades: {gradeTags.join(', ')} </p>}
      <CompContainer comps={comps}/>
    </section>
  );
}