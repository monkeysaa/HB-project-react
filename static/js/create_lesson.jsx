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

      formData.append('blob', new Blob(['Hello World!']), 'test')

      fetch('/api/lesson-pic', {
          method: 'POST',
          body: formData,
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then(response => response.json())
          .then(res => {
              console.log(res);
              setImgUrl(res);
              // <img className='lesson' src=imgUrl/>
          })
    }
          

      return (
        // if it's a form, need to prevent default... necessary if no form action?
        <React.Fragment>
          <h2>Create a Lesson</h2>
          <form 
            action='/api/lesson-pic' 
            method='POST' encType='multipart/form-data'>
            <input type='file' name='blob' />
            <input 
              type='submit' 
              onClick={handlePic}/>
          </form> 

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