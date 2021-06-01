"use strict";
// 

function CompTemplate(props) {
    return (
      <div className="component">
        <p> {props.title} </p>
        <img src={props.img} />
        <a href={`${props.link}`}> </a>
      </div>
    );
  }

function EditLesson() {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState('');
    const [author, setAuthor] = React.useState('')

    // Figure out how to handle these and where to set this up. 
    // const photoDiv = []
    // photoDiv.push(
    //   <button onClick={handleNewPhoto}>Edit Photo</button>;
    // )

    // Do not remove or it will break
    let { lesson_id } = useParams();
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            setLesson(data.lesson[0]);
            setAuthor(data.lesson[0].author);
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    // These features of a lesson can be edited. Handle separately.
    // Figure out how often to re-render and what to put in final brackets
    React.useEffect(() => {
      setTitle(lesson.title);
      setLessonPic(lesson.imgUrl);
    //   Add comps here, since they can be edited?
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

    const handlePhotoChange() {
      // set <div id="photodiv"> to visible rather than hidden
    }

    const handleTitleChange() {
      // set <div id="titlediv"> to visible rather than hidden
    }

    // Copied from Create Lesson wtih setLessonID removed. Needs to be refactored.
    const updatePhoto = (evt) => {
      evt.preventDefault();

      const formData  = new FormData();
      const file = document.getElementById('my-file').files[0];

      formData.append('my-file', file);

      fetch('/api/add_pic', {
          method: 'POST',
          body: formData,
          })
          .then(response => response.json())
          .then(res => {
            // setLessonID(res.lesson_id)
            setLessonPic(res.imgUrl);
          })
    }
  
    // Copied from Create Lesson wtih setLessonID removed. Needs to be refactored.
    const updateLesson = (evt) => {
      evt.preventDefault();

      const lesson = {"title": title, "lesson_id": lesson_id}

      fetch('/api/title_lesson', {
        method: 'POST',
        body: JSON.stringify(lesson),
        headers: {
            'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
      if (data.success == false) {
          alert('Something done broke.');
      } else if (data.success === true) {
          alert('Lesson created successfully!');
          window.location.href = `/lesson/${lesson_id}`;
      } else {
          alert('Something done broke');
      }
      })
      }
          
    

    return (
      <section className="lesson">
        <div>
          <h3> Editing Lesson {lesson_id}</h3>
        </div>
        <img src={lessonPic}></img>
        <button onClick={handlePhotoChange}>Edit Cover Photo</button>
        {/* make photodiv hidden and onclick */}
        <div id="photodiv">
          <form 
              onSubmit={updatePhoto}
              action='/api/lesson-pic' 
              method='POST' encType='multipart/form-data'>
              <input 
                type="hidden"
                name="lesson_id"
                value={lesson_id}
              />
              <input 
                id = 'my-file'
                type='file' name='my-file' /> 
              <input 
                type='submit' 
                />
            </form> 
        </div>
        <h2>{`${title} by ${author}`}</h2>
        <button onClick={handleTitleChange}>Edit Title</button>
        <div id="titlediv">
        <form> 
            <input 
                className="edit_lesson"
                type="text" 
                placeholder={title}
                onChange={(e) => setTitle(e.target.value)}
                value={title} 
            /><br></br>
            <input 
                className="edit_lesson"
                type="text" 
                placeholder={description}
                onChange={(e) => setDescription(e.target.value)}
                value={description} />
            <section className='add-content'> 
            {/* potentially two classes: add content AND add-component */}
                <button id='add-content'>Add Content to Lesson</button>
            </section>
            <input 
              type="hidden"
              name="lesson_id"
              value={lesson_id}
            />
            <button onClick={updateLesson}> Save </button>
          </form>
        </div>
        <div>{compCards}</div>
      </section>
    );
  }