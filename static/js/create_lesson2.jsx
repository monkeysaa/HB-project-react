function NewLesson() {
  const history = ReactRouterDOM.useHistory();
  // new URL: history.push

  const [title, setTitle] = React.useState('');
  const [overview, setOverview] = React.useState('');

  // comps: An array of POJOs, each with data for a single lesson component. 
  const [comps, setComps] = React.useState([]); 
  
  // let compCards = [];   // an array of Lesson-Component cards to display

  // for (const comp of comps) {
  //   compCards.push(
  //     <CompCard
  //       key={comp.id}
  //       id={comp.id}
  //       type={comp.type}
  //       url={comp.url}  // e.g. link or embedded video link
  //       img={comp.imgUrl} // e.g. thumbnail or image link from Cloudinary
  //       text={comp.text}
  //       title={comp.title}
  //       source={comp.source}
  //       favicon={comp.favicon}
  //       description={comp.description}
  //     />
  //   );
  // }

  // TODO: Remove before finalizing code

  console.log('Component Update!');
  console.log(comps);

  const createLesson = (evt) => {
    evt.preventDefault();

    // push all lesson component ids into an array
    let comp_ids = [];
    for (let comp of comps) {
      comp_ids.push(comp.id);
    }

    const formData  = new FormData();
    const file = document.getElementById('lesson-pic').files[0];

    formData.append('lesson-pic', file);
    formData.append('title', title);
    formData.append('overview', overview);
    formData.append('component-ids', comp_ids);

    fetch('/api/create_lesson', {
        method: 'POST',
        body: formData,
        })
    .then(response => response.json())
    .then(res => {
      if (res.success === false) {
          alert('something done broke.');
      } else if (res.success == true) {
          alert(`Lesson ${res.lesson_id} created successfully!`);
          history.push(`/lesson/${res.lesson_id}`);
      }
    })
  }
  
  // Handle this with React rather than JS
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
        <form id="lesson-input-form" 
          onSubmit={createLesson}>
          <section className="lesson_inputs">
            <input 
              id = 'lesson-pic'
              // TODO: May not need "name on line 90"
              type='file' name='lesson-pic' 
              onChange={() => displayElement('placeholder')}/> 
            <input 
              type="text" 
              placeholder="First, give your lesson a compelling title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title} 
            /><br/>
            <input 
              type="text" 
              placeholder="Then, add a catchy description!"
              onChange={(e) => setOverview(e.target.value)}
              value={overview} 
            /><br/>
            <div id='tags'>

              <p>
                {/* <input type="checkbox" name="grades" value="4th" 
                  onChange={handleToggle} checked={state[key]}/>
                  <label>4th</label> */}
                <input type="checkbox" name="grades" value="5th"/><label>5th</label>
                <input type="checkbox" name="grades" value="6th"/><label>6th</label>
              </p>
              <p>
                <input type="checkbox" name="subjects" value="math"/><label>Math</label>
                <input type="checkbox" name="subjects" value="science"/><label>Science</label>
                <input type="checkbox" name="subjects" value="writing"/><label>Writing</label>
              </p>
            </div>
        </section>
        <ComponentInputCase comps={comps} setComps={setComps}/>
        <input type='submit' />

      </form> 
      {/* Add a plus --> when clicked,adds a component */}
      {/* Show a minus */}
      </section>
      <section className="lesson-display">
        <p hidden>Display a Lesson</p>
        <h2 className="new_lesson">{title}</h2>
        <img id='placeholder' src='/static/img/placeholder.png' hidden/>
        <h3 className="new_lesson">{overview}</h3>
        <div id="comps">
          <CompContainer comps={comps}/>
        </div>
      </section>

    </div>

  )
}