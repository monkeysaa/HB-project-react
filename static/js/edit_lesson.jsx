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

function EditLesson() {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState('');
    const [author, setAuthor] = React.useState('')

    // Do not remove or it will break
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
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    // Consider handling editable features of a lesson in a separate useEffect hook.
    // If so, need to figure out how often to re-render and what to put in final brackets
    // React.useEffect(() => {
      // // Add comps, title, imgUrl here, since they can be edited?
    // }, []);
  
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

    function handlePhotoChange(el) {
      // remove hidden attribute on photodiv change features
      if (document.getElementById('photodiv').hidden) {
        document.getElementById('photodiv').removeAttribute("hidden");
      } 
      else {
        document.getElementById('photodiv').setAttribute("hidden");
      }
    }

    function handleTitleChange() {
      // remove hidden attribute on titlediv change features
      if (document.getElementById('titlediv').hidden) {
        document.getElementById('titlediv').removeAttribute("hidden");
      } 
      else {
        document.getElementById('titlediv').setAttribute("hidden");
      }
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
            alert('Lesson updated successfully!');
            window.location.href = `/lesson/${lesson_id}`;
        } else {
            alert('Something done broke');
        }
      })
    }
          
    // Set up onChange functions to take title, description, etc. 
    // Test onChange for key-value pair rather than using formData above

    return (
      <section className="lesson">
        <div>
          <h3> Editing Lesson {lesson_id}</h3>
        </div>
        <img src={lessonPic}></img>
        <button onClick={handlePhotoChange}>Edit Cover Photo</button>
        <div id="photodiv" hidden>

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
                type='file' 
                name='my-file' /> 
              <input 
                type='submit' 
                />
            </form> 

        </div>
        <h2>{`${title} by ${author}`}</h2>
        <button onClick={handleTitleChange}>Edit Title</button>
        <div id="titlediv" hidden>
          <form> 
              <input 
                  className="edit_lesson"
                  type="text" 
                  placeholder="Give your lesson a compelling title..."
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
              /><br></br>
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