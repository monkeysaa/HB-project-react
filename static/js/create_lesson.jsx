// should this be a separate component or a function within the Profile page?

function NewLesson() {
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [imgUrl, setImgUrl] = React.useState('')
    // const [link, setLink] = React.useState('')

    const submitLesson = (evt) => {
      evt.preventDefault();

      const lesson = {"title": title, "description": description}

      fetch('/api/create_lesson', {
        method: 'POST',
        body: JSON.stringify(lesson),
        headers: {
            'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
      if (data.success == false) {
          alert('Lesson with this title already exists. Please be more creative.');
      } else if (data.success === true) {
          alert('Lesson created successfully!');
          // TODO: direct to the correct lesson :)
          window.location.href = '/lesson';
      } else {
          alert('Something done broke');
      }
      })
      }

    const handlePic = (evt) => {
      evt.preventDefault();

      // Code for uploading lessonpic
      // Needs to process multi-form data rather than JSON

      const formData  = new FormData();
      const file = document.getElementById('my-file').files[0];

      formData.append('my-file', file);

      fetch('/api/lesson-pic', {
          method: 'POST',
          body: formData,
          })
          .then(response => response.json())
          .then(res => {
              setImgUrl(res);
          })
    }
          

      return (
        // if it's a form, need to prevent default... necessary if no form action?
        <React.Fragment>
          <h2>Create a Lesson</h2>
          <form onSubmit={handlePic}
            action='/api/lesson-pic' 
            method='POST' encType='multipart/form-data'>
            <input 
              id = 'my-file'
              type='file' name='my-file' /> 
            {/* sending 'my-file' and file itself as a key-value pair */}
            <input 
              type='submit' 
              />
          </form> 
          <div>
            <img className='lesson' src={imgUrl}/>
          </div>

          <form> 
            <input 
                className="new_lesson"
                type="text" 
                placeholder="First, give your lesson an awesome title..."
                onChange={(e) => setTitle(e.target.value)}
                value={title} 
            /><br></br>
            <input 
                className="new_lesson"
                type="text" 
                placeholder="Then, add a catchy description!"
                onChange={(e) => setDescription(e.target.value)}
                value={description} 
            />
            {/* <section className='add-component'>
                <button id='add-content'>Add Content to Lesson</button>
            </section> */}
            <button onClick={submitLesson}> Save </button>
          </form>
        </React.Fragment>
 
      )
}