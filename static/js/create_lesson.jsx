
function NewLesson() {

  const history = ReactRouterDOM.useHistory();
  const [title, setTitle] = React.useState('');
  const [overview, setOverview] = React.useState('');
  const [grades, setGrades] = React.useState([]);
  const [lessonPic, setLessonPic] = React.useState('/static/img/placeholder-image.png')
  const [subjects, setSubjects] = React.useState([]);

  // const [lessonPic, setLessonPic] = React.useState(null);

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
          <Alert key='successful-lesson' variant='success'>
            Lesson created successfully!
          </Alert>
          alert(`Lesson ${res.lesson_id} created successfully!`);
          history.push(`/lessons/${res.lesson_id}`);
      }
    })
  }
  
  // Handle this with React rather than JS
  const displayElement = (id) => {
    // remove hidden attribute on an element
    if (document.getElementById(id).hidden) {
      document.getElementById(id).removeAttribute("hidden");
    } 
  };

  // TODO: Figure out SetLesson & Display a temporary image upon upload
  // const displayImg = (evt) => {

  //   console.log(document.getElementById('lesson-img-display'));
  //   const pic = evt.originalEvent.srcElement.files[0];
  //   const img = document.getElementById('lesson-img-display');

  //   let reader = new FileReader();
  //   reader.onloadend = function() {
  //     img.src = reader.result;
  //   }
  //   reader.readAsDataURL(pic);
  // };

  return (
    <div className='create-lesson'>
      <section className="lesson-mockup" id='lesson-inputs-complete'>
        <h2>Create a Lesson</h2>
        <form id="lesson-input-form" 
          onSubmit={createLesson}>
          <section className='lesson-inputs' id='lesson-inputs-wrapper'>
            
            <section className="lesson_inputs" id='lesson-inputs-lesson-pic'>
              <input 
                id = 'lesson-pic'
                // TODO: May not need "name on line 90"
                type='file' name='lesson-pic' 
              />
              {/* onChange={() => displayElement('placeholder')}/>  */}
              <img className='lesson_inputs' 
                  id='placeholder-img' 
                  src='/static/img/placeholder-image.png' 
                  // hidden/>
              />
            </section>

            <section className="lesson_inputs" id='lesson-inputs-general'>
              <input 
                id='lesson-inputs-title' 
                type="text" 
                placeholder="First, give your lesson a compelling title..."
                onChange={(e) => setTitle(e.target.value)}
                value={title} 
              /><br/>

              <textarea 
                id='lesson-inputs-overview' 
                name='overview'
                rows='8' cols='75'
                placeholder="Then, add a catchy description!"
                onChange={(e) => setOverview(e.target.value)}
                value={overview} 
              /><br/>

              <button type='button' 
                className='lesson-inputs' 
                onClick={() => displayElement('tag-inputs')}
                id='lesson-inputs-add-tags-btn'>Add Grade and Subject Tags
              </button>
            </section>
            <section className='lesson-inputs' id='tag-inputs' hidden>
              <ShowTags />
            </section>
            <section id="components-display">
              <CompContainer comps={comps}/>
            </section>
          </section>
          <section className='lesson-inputs' id='add-comps-btns'>
            <CreateComp setComps={setComps}/>
            <p>Add a New Lesson Component</p>
            <button type='button' 
                className='lesson-inputs' 
                onClick={() => displayElement('comp-input-url')}
                id='lesson-inputs-add-url-btn'>Add Link
            </button>
            <button type='button' 
              className='lesson-inputs' 
              onClick={() => displayElement('comp-input-img')}
              id='lesson-inputs-add-img-btn'>Add Image
            </button>
            <button type='button' 
              className='lesson-inputs' 
              onClick={() => displayElement('comp-input-text')}
              id='lesson-inputs-add-text-btn'>Add Text
            </button>
            <button type='button' 
              className='lesson-inputs' 
              onClick={() => displayElement('comp-input-url')}
              id='lesson-inputs-add-url-btn'>Add Video
            </button>
          </section>
          <input id='lesson-inputs-submit' type='submit' />
        </form> 
      </section>

      {/* Add a plus --> when clicked,adds a component */}
      {/* Show a minus */}
    </div>

  )
}