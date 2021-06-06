// should this be a separate component or a function within the Lesson Object? Or Profile Page?

function NewLesson() {
    const [title, setTitle] = React.useState('');
    const [overview, setOverview] = React.useState('');
    const [test, setTest] = React.useState('');

    const makeTest = (evt) => setTest(evt.target.value);

    const createLesson = (evt) => {
      evt.preventDefault();

      const formData  = new FormData();
      const file = document.getElementById('lesson-pic').files[0];

      formData.append('lesson-pic', file);
      formData.append('title', title);
      formData.append('overview', overview);

  // comps = []
  // for (const comp of comps) {
  //   comps.push(
  //     <CompTemplate
  //       key={comp.component}
  // //       img={comp.c_img}
  //       comp_link={link}
  //     />
  //   );
  // }

      fetch('/api/create_lesson', {
          method: 'POST',
          body: formData,
          })
      .then(response => response.json())
      .then(res => {
        if (res.success === false) {
            alert('something done broke.');
        } else if (res.success == true) {
            alert('Lesson created successfully!');
            window.location.href = `/lesson/${res.lesson_id}`;
        }
      })
    }
  


  return (
    <React.Fragment>
      <h2>Create a Lesson</h2>
      <form onSubmit={createLesson}
        action='/api/create_lesson' 
        method='POST' encType='multipart/form-data'>
        <section id="primaryLesson">
          <input 
            id = 'lesson-pic'
            type='file' name='lesson-pic' /> 
          <input 
              className="new_lesson"
              type="text" 
              placeholder="First, give your lesson a compelling title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title} 
          />            <br/>
          <input 
              className="new_lesson"
              type="text" 
              placeholder="Then, add a catchy description!"
              onChange={(e) => setOverview(e.target.value)}
              value={overview} 
          /><br/>
        </section>
        <LessonComponentCase />
        <input type='submit' />
      </form> 
      {/* Add a plus --> when clicked,adds a component */}
      {/* Show a minus */}

    </React.Fragment>

  )
}