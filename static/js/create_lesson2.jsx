// should this be a separate component or a function within the Profile page?

function NewLesson() {
    const [title, setTitle] = React.useState('')
    const [overview, setOverview] = React.useState('')

    const createLesson = (evt) => {
      evt.preventDefault();

      // Code for uploading lessonpic
      // Needs to process multi-form data rather than JSON

      const formData  = new FormData();
      const file = document.getElementById('my-file').files[0];

      formData.append('my-file', file);
      formData.append('title', title);
      formData.append('overview', overview);

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
          <input 
            id = 'my-file'
            type='file' name='my-file' /> 
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
          {/* <section className='add-component'>
              <button id='add-content'>Add Content to Lesson</button>
          </section> */}
          <input 
            type='submit' 
            />
        </form> 

      </React.Fragment>

    )
}