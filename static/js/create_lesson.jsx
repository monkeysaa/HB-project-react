function NewLesson() {
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    // const [link, setLink] = React.useState('')

    const submitLesson = (e) => {
        e.preventDefault();
  
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
          console.log(data)
        //   redirect to the editable lesson page? 
        })
        //       .then(data => {
        // if (data.success == false) {
        //     alert('Lesson with this title already exists. Please be more creative.');
        // } else if (data.success === true) {
        //     alert('Lesson created successfully!');
        //     // TODO: direct to the correct lesson :)
        //     window.location.href = '/lesson';
        // } else {
        //     alert('Something done broke');
        // }
        // })
      }

      return (
        // if it's a form, need to prevent default... necessary if no form action?
        <form> 
          Title: 
          <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)}
            value={title} 
          />
          Email: 
          <input 
            type="text" 
            onChange={(e) => setDescription(e.target.value)}
            value={description} 
          />
          <button onClick={submitLesson}> Save </button>
        </form>
      )
}