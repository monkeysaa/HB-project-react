"use strict";

// const { cloneElement } = require("react");

function EditLesson() {
  
    const history = ReactRouterDOM.useHistory();
    const { lesson_id } = useParams();
    // console.log(lesson_id);
    const [title, setTitle] = React.useState('');
    const [author, setAuthor] = React.useState('');
    const [overview, setOverview] = React.useState('');
    const [lessonPic, setLessonPic] = React.useState('');
    const [comps, setComps] = React.useState([]);
    
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.lesson);
        setTitle(data.lesson.title);
        setAuthor(data.lesson.author);
        setLessonPic(data.lesson.imgUrl);
        setOverview(data.lesson.overview);
        setComps(data.comps);
      })
    }, []);

    function handleEdit() {
      // remove hidden attribute on photodiv change features

      if (document.getElementById('photodiv').hidden) {
        document.getElementById('photodiv').removeAttribute("hidden");
      } 
      else {
        document.getElementById('photodiv').setAttribute("hidden");
      }
    }

    const updateLesson = (evt) => {
      evt.preventDefault();

      console.log(lesson_id);
      // Should I use this sort of structure instead? 
      const lessonData = []
      lessonData.push (
        {
          "lesson_id": lesson_id, 
          "title": title, 
          "overview": overview,
        });
      
      // handle components
      
      const formData  = new FormData();
      const file = document.getElementById('my-file').files[0];
        
      formData.append('my-file', file);
      formData.append('title', title);
      formData.append('overview', overview);
      formData.append('lesson_id', lesson_id);

      fetch(`/api/lessons/${lesson_id}`, {
          method: 'POST',
          body: formData,
          })
      .then(response => response.json())
      .then(res => {
        if (res.success == true) {
          <Alert variant='warning'>
            Lesson updated successfully!        
          </Alert>          
          history.push(`/lessons/${res.lesson_id}`);
        } else {
          alert('something done broke.'); 
        }
      })
    }

    return (
      <section className="lesson">
        <div>
          <h3> Editing Lesson {lesson_id}</h3>
          <h2>{`${title} by ${author}`}</h2>
        </div>
        <img src={lessonPic}></img>
        <br/>
        <form 
          onSubmit={updateLesson}>
          <input 
            type="hidden"
            name="lesson_id"
            value={lesson_id}
          /> 
          <button type='button' onClick={handleEdit}>Edit Cover Photo</button>
          <div id="photodiv" hidden>
            <input 
              id = 'my-file'
              type='file' 
              name='my-file' /> 
          </div>
          <h2>{`Change title from ${title} to:`}</h2>
          <input 
              className="edit_lesson"
              type="text" 
              placeholder="Give your lesson a compelling title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
          /><br/>
          <h2>{`Edit your lesson overview:`}</h2>
          <textarea 
            className="edit_lesson"
            type="text" 
            placeholder="Then, add a catchy description!"
            onChange={(e) => setOverview(e.target.value)}
            value={overview}
          /><br/>
          <input 
            type='submit' 
          />
        </form> 
        <CompContainer comps={comps}/>

      </section>
    );
}
