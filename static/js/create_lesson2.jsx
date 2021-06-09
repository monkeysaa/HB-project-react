// should this be a separate component or a function within the Lesson Object? Or Profile Page?

function NewLesson() {
  const [title, setTitle] = React.useState('');
  const [overview, setOverview] = React.useState('');
  // comps: An array of POJOs, each with data for a single lesson component. 
  const [comps, setComps] = React.useState([]); 
  
  let compCards = [];   // an array of Lesson-Component cards to display

  for (const comp of comps) {
    compCards.push(
      <CompCard
        key={comp.id}
        id={comp.id}
        type={comp.type}
        img={comp.imgUrl} // e.g. thumbnail or image link from Cloudinary
        url={comp.url}  // e.g. link or embedded video link
        text={comp.text}
      />
    );
  }

  React.useEffect(() => {
    
  }, [comps]);

  const createLesson = (evt) => {
    evt.preventDefault();

    const formData  = new FormData();
    const file = document.getElementById('lesson-pic').files[0];

    formData.append('lesson-pic', file);
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
  
  const displayElement = (id) => {
    // remove hidden attribute on an element
    console.log(id);
    if (document.getElementById(id).hidden) {
      document.getElementById(id).removeAttribute("hidden");
    } 

  }

  return (
    <div className='create-lesson'>
      <section className="lesson-inputs">
        <h2>Create a Lesson</h2>
        <form onSubmit={createLesson}
          action='/api/create_lesson' 
          method='POST' encType='multipart/form-data'>
          <section id="primaryLesson">
            <input 
              id = 'lesson-pic'
              type='file' name='lesson-pic' 
            onChange={() => displayElement('placeholder')}/> 
            <input 
                className="lesson_inputs"
                type="text" 
                placeholder="First, give your lesson a compelling title..."
                onChange={(e) => setTitle(e.target.value)}
                value={title} 
            />            <br/>
            <input 
                className="lesson_inputs"
                type="text" 
                placeholder="Then, add a catchy description!"
                onChange={(e) => setOverview(e.target.value)}
                value={overview} 
            /><br/>
        </section>
        <ComponentInputCase comps={comps} setComps={setComps}/>
        <input type='submit' />

      </form> 
      {/* Add a plus --> when clicked,adds a component */}
      {/* Show a minus */}
      </section>
      <section className="lesson-display">
        <p>Display a Lesson</p>
        <h2 className="new_lesson">{title}</h2>
        <img id='placeholder' src='/static/img/placeholder.png' hidden/>
        <h3 className="new_lesson">{overview}</h3>
        <div id="comps">
          {compCards}
        </div>
      </section>

    </div>

  )
}