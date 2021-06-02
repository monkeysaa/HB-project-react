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

// Why is this looping infinite times??
function EditLesson() {

  debugger;
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState('');
    const [author, setAuthor] = React.useState('')

    let { lesson_id } = useParams();
    console.log(lesson_id);
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data,lesson[0]);
            setLesson(data.lesson[0]);
            setAuthor(data.lesson[0].author);
            setTitle(data.lesson[0].title);
            setLessonPic(data.lesson[0].imgUrl);
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

    React.useEffect(() => {
      // Add comps, title, imgUrl here, since they can be edited

        const lessonData = []
        lessonData.push (
          {
            "lesson_id": lesson_id, 
            "title": title, 
            "author": author, 
            "imgUrl": lessonPic
          }
        )

        for (let comp of comps) {
          lessonData.push(comp)
        }

        setLesson(lessonData)
      }, [lessonPic, comps, title]);

    // Refactor these two; they're nearly identical
    function handlePhotoChange() {
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

    // Create Lesson function, minus setLessonID. Refactor with React?
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
  
    // Create Lesson function, minus setLessonID. Refactor with React?
    const updateLesson = (evt) => {
      evt.preventDefault();

      fetch('/api/update_lesson', {
        method: 'POST',
        body: JSON.stringify(lesson),
        headers: {
            'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success == true) {
            // alert('Something done broke.');
            alert('Got a response')
        } else {
            alert('Whyyyyy <sob>')
        } 
      })
    }
          
    // Set up onChange functions to take title, description, etc. 
    // Test onChange for key-value pair rather than using formData above

    return (
      <section className="lesson">
        <div>
          <h3> Editing Lesson {lesson_id}</h3>
          <button onClick={updateLesson}> Save Changes </button>
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