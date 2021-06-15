
function NewLesson() {

  const history = ReactRouterDOM.useHistory();
  const [title, setTitle] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [lessonPic, setLessonPic] = React.useState(null);

  // comps: An array of POJOs, each with data for a single lesson component. 
  const [comps, setComps] = React.useState([]); 
  
  const GRADE_TAGS = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
  '9th', '10th', '11th', '12th'];
  const SUBJ_TAGS = ['Math', 'Writing', 'Reading', 'Science', 'Social Studies', 
  'Arts/Music', 'Foreign Lang.'];

  const createLesson = (evt) => {
    evt.preventDefault();
    
    let comp_ids = [];
    for (let comp of comps) {
      comp_ids.push(comp.id);
    }

    const formData  = new FormData();
    const file = document.getElementById('lesson-pic').files[0];

    const tagsArray = []
    const tagEls = document.querySelectorAll('input[type="checkbox"]:checked')
    for (const tag of tagEls) {
      tagsArray.push(tag.value);
    } 

    formData.append('lesson-pic', file);
    formData.append('title', title);
    formData.append('overview', overview);
    formData.append('component-ids', comp_ids);
    formData.append('tags', tagsArray);

    fetch('/api/lessons', {
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

  };

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
              

                {/* <input type="checkbox" className="grades" value="4th" 
                  onChange={handleToggle} checked={state[key]}/>
                  <label>4th</label> */}
                  
                <input type="checkbox" className="tags" name="grades" value="5th"/><label>5th</label>
                <input type="checkbox" className="tags" name="grades" value="6th"/><label>6th</label>
              </p>
              <p>
                <input type="checkbox" className="tags" name="subjects" value="Math"/><label>Math</label>
                <input type="checkbox" className="tags" name="subjects" value="Science"/><label>Science</label>
                <input type="checkbox" className="tags" name="subjects" value="Writing"/><label>Writing</label>
              </p>
            </div>
        </section>
        <ComponentInputContainer comps={comps} setComps={setComps}/>
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