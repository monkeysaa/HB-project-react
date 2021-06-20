'use strict';
// COMPONENT.JSX PROVIDES REACT COMPONENTS RELATED TO THE "COMPONENTS" 
// (PARTS OF A LESSON).


// TODO: Nice to have: Create cards for Components to drag them around. 
// TODO: If website's X-Frames set to DENY, do not render iFrame. 
// X-Frame-Options listed within the HTTP response header
// 
// const displayImageInput = (id) => {
//   // remove hidden attribute on an element
//   console.log(id);
//   if (document.getElementById(id).hidden) {
//     document.getElementById(id).removeAttribute("hidden");
//   } 
// }

// 
function ComponentInputContainer({comps, setComps}) {
  const [inputComps, setInputComps] = React.useState([0]);
  const compsHTML = [];

  // TODO: Remove this loop, as only one place to enter Component. 
  // TODO: On Component display, create a way to delete or move components
  let key = 0;
  for (let comp of inputComps) {
    let param = key
    compsHTML.push(
      <div key={key}>
        <CreateComp setComps={setComps}/>
        {/* <button type="button" onClick{() => displayImageInput}> <i className="fa fa-image" /> </button> */}
        {/* <button type='button' onClick={() => removeComponent(param)}> <i className="fa fa-trash" /> </button> */}
      </div>
    );
    key += 1;
  }

   function addComponent(index = -1, comp = 0) {
    let tempComps = [...inputComps];

    if (index < 0 || index > tempComps.length) {
      index = tempComps.length;
    }
    tempComps.splice(index, 0, comp);
    setInputComps(tempComps);
    console.log(inputComps);
  }

  function removeComponent(index) {
    let tempComps = [...inputComps];

    if (index < 0 || index >= tempComps.length) {
      alert('No index provided');
      return;
    }
    tempComps.splice(index, 1);
    setInputComps(tempComps);
    console.log(inputComps);
  }

  return (
    <React.Fragment>
      {compsHTML}
      {/* <button type='button' onClick={() => addComponent()}>Add Component</button> */}
      {/* Buttons to add new button */}
      {/* Buttons to move around existing components */}
    </React.Fragment>
  )
}

// #*########################################################################*#
// #*#                          Create & Store Component                    #*#
// #*########################################################################*#
// TODO: Remove from Single Lesson. 

// function CompAdded()

// Have 3 children : UrlInput, ImgInput, TextInput. 
// Logic for back-end communication should happen in parent. 
// pass saveComp as a function that takes 2 inputs: type and text. 

function CreateComp({setComps}) {

  const saveComp = (compToSave, compType) => {

    const compData = {};

    if (compToSave === '') {
      <Alert key='empty-component-url' variant='warning'>
        Update this field before adding.
      </Alert>
      alert('Update this field before adding.');
    }
    compType === 'url' ? compData.url=compToSave : compData.text=compToSave;

    fetch('/api/components/', {
      method: 'POST',
      body: JSON.stringify(compData),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(({comp}) => { // Destructures response and gives only value of 'comp' key
      console.log(comp);
      // Use ... whenever you update a state array. 
      // Array of response objects
      // Every time I get an HTTP response back, I parse out the HTTP response and check if it's HTTP 200 Okay
      // If it's good, I take data and append it to a component objct. Then I append that to a growing array of all the components the user has added this session.  
      setComps(currentComps => [...currentComps, comp]); // give it a function and the argument is teh current value of the state
    })

  };

  const saveFile = (compToSave) => {

    const formData = new FormData();
    const file = document.getElementById('comp-pic').files[0];
    formData.append('comp-pic', file);

    fetch('/api/components/', { 
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(({comp}) => { // Destructures response. This becomes 'comp' variable
      setComps(currentComps => [...currentComps, comp]); 
    })
  
  };

  return (
    <div className='comp-inputs' id='comp-inputs-wrapper'>
 
{/* if file upload functionality: <i className="fa-solid fa-image"></i>*/}
      <UrlInput saveComp={saveComp}/>
      <TextInput saveComp={saveComp}/>
      <ImgInput saveFile={saveFile}/>

    </div>
  )
}

function TextInput({saveComp}) {
  const [text, setText] = React.useState('');

  return(
    <article id='comp-input-text' hidden>
      <label id='comp_text' htmlFor='comp_text' name='comp_text'>Add Text:</label>
      <textarea id='comp_text' name='comp_text' rows='5' cols='33'
        placeholder='Add Text'  value={text} 
        onChange={(e) => {setText(e.target.value)}}> </textarea>
      <button id='comp-text-btn'  type='button' onClick={() => {saveComp(text, 'text')}}>Add Text </button>
      <br></br><br></br>
    </article>
    
  )
}


function UrlInput({saveComp}) {
  const [url, setUrl] = React.useState('');

  return(
    <article id='comp-input-url' hidden>
      <label htmlFor="componentInput"></label>
      <i className="fa fa-link"></i>
      <input 
        id = 'comp_url'
        type="text"  
        placeholder="Paste full website url here"
        onChange={(e) => { setUrl(e.target.value)}}
        value={url} 
      />
      <button type='button' onClick={() => {saveComp(url, 'url') }}>
        <i className="fa fa-plus"/>
      </button>
    </article>
  )
}

function ImgInput({saveFile}) {
  const [file, setFile] = React.useState(null);

  return(
    <article id='comp-input-img' hidden>
      <p>
      <i className="fa fa-image"></i>
      Upload an image
      <input id = 'comp_pic' type = 'file' name = 'comp_pic' 
        onChange={(event) => setFile(event.target.files[0])}
              />

      {/* TODO: change this function to take file and return a string using Fatima's solution*/}
      <button id='comp-pic-btn' type='button' 
        onClick={() => {saveFile(file)} }>
        <i className="fa fa-plus"/></button>
      </p>
    </article>
  )
}


// TO BE DEVELOPED: 
// function Text({text, setText}) {
//   const editor = useMemo(() => withReact(createEditor()), []);
//   const [value, setValue] = useState([]);
//   return (
//     // Add the editable component inside the context.
//     <Slate
//       editor={editor}
//       value={value}
//       onChange={newValue => setValue(newValue)}
//     >
//       <Editable />
//     </Slate>
//   )
// }


// #*#######################################################################*#
// #*#                          Display Saved Components                   #*#
// #*#######################################################################*#

function CompContainer({comps}) {
  // comps is high-level data-container in <NewLesson>

  // CompContainer is the display container Component in CreateLesson and SingleLesson
  // compCards is display container array
  // CompCard is the Card template for display
  // CompCard is the card itself
  const compCards = [];
  // console.log(comps);

  for (const comp of comps) {
    console.log(comp);
    compCards.push(
      <CompCard
        key={comp.id}
        id={comp.id}
        type={comp.type}
        url={comp.url} // e.g. link or embedded video link
        img={comp.img} // e.g. thumbnail or image link from Cloudinary
        text={comp.text}
        title={comp.title}
        source={comp.source}
        favicon={comp.favicon}
        description={comp.description}
      />
    );
  }

  return (
    <div>{compCards}</div>

  );
}

function CompCard(props) {
  // props: id, type, url, img, text, title, source, favicon, description

  const video_id = `comp_video_${props.id}`;
  const img_id = `comp_img_${props.id}`;
  return (
    <section className="comp-card wrapper" id={props.id}>

      {/* will display either img OR iFrame, but not both */}
      {(props.type === 'video' || props.type === 'url') &&  
        (<h3> <a href={`${props.url}`}> {props.title} </a> </h3>)}
      {(props.type === 'video') && 
        <IFrame props={props} video_id={video_id} img_id={img_id}/>}
      {(props.type === 'img') && 
        <img className='comp-card' id='comp-img' src={props.img}/>}
      {(props.source && props.favicon) ? 
        (<p className='comp-card'>
        <img className='comp-card' id='comp-icon' src={`${props.favicon}`}/> 
        {props.source}</p> ) : null}
      {(props.description) && <p> {props.description} </p> }
      {(props.text) && <div> {props.text} </div> }

      <p className='comp-btns'> 
        <button 
          type='button' 
          onClick={() => console.log('figure out how to move comp')}> 
          <i className="fa fa-toggle-up" /> 
        </button>
        <button 
          type='button' 
          onClick={() => console.log('figure out how to move comp')}> 
          <i className="fa fa-toggle-down" /> 
        </button>
        <button 
          type='button' 
          onClick={() => console.log('figure out how to trash comp')}> 
          <i className="fa fa-trash" /> 
        </button>
      </p>
      
    </section>
  );
}

// Ask Seema about passing variables both in & outside props
// TODO: if iFrames are disabled, show placeholder url
      // else... 
function IFrame({props, video_id, img_id}) {

  // React.useEffect(() => {
  //   // if ((props.type === 'video') | (!(props.id === 5) && !(props.id === 10) )){

  //   //   document.getElementById(img_id).setAttribute("hidden", true);
  //   //   // console.log('test1');
  //   // }
  //   // else {  // handles case of files, etc
  //   //   document.getElementById(video_id).innerHTML = "";
  //   //   // console.log('test2');
  //   // }
  // });

  return (
    <React.Fragment>
      {/* Look up how to deal with broken links:  */}
   <p>IFRAME</p>
    <iframe 
      id={video_id} 
      width='560' 
      height='315' 
      src={`${props.url}`} 
      title={props.type} 
      frameBorder='0' 
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
      allowFullScreen 
    ></iframe>

    </React.Fragment>
 
  );
}




