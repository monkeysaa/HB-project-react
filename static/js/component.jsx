'use strict';
// COMPONENT.JSX PROVIDES REACT COMPONENTS RELATED TO THE "COMPONENTS" 
// (PARTS OF A LESSON).


// TODO: Nice to have: Create cards for Components to drag them around. 
// TODO: If website's X-Frames set to DENY, do not render iFrame. 
// X-Frame-Options listed within the HTTP response header

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

function CreateComp({setComps, toggleInput}) {

  const saveComp = (compToSave, compType, button_id) => {

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

    toggleInput(button_id);

  };

  const saveFile = (buttonId) => {
    console.log(buttonId);

    const formData = new FormData();
    const file = document.getElementById('comp-img-input').files[0];
    formData.append('comp-img', file);

    fetch('/api/components/', { 
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(({comp}) => { // Destructures response. This becomes 'comp' variable
      console.log(comp);
      setComps(currentComps => [...currentComps, comp]); 
    })

    toggleInput(buttonId);
    console.log('In theory, have link from DB and input has disappeared')
  
  };

  return (
    <div className='comp-inputs' id='comp-inputs-wrapper'>
 
{/* if file upload functionality: <i className="fa-solid fa-image"></i>*/}

      <UrlInput saveComp={saveComp}/>
      <TextInput saveComp={saveComp}/>
      <ImgInput saveFile={saveFile}/>
      <UrlInput saveComp={saveComp}/>


    </div>
  )
}

{/* TODO: Replace SaveComp('comp-input-img') input with actual id  */}
function TextInput({saveComp}) {
  const [text, setText] = React.useState('');

  return(
    // TODO: Fix all the tags so there are no repeats
    <article id='comp-input-text' hidden>
      <label id='comp-text-input' htmlFor='comp-text-input' 
        name='comp-text-input'>Add Text:</label>
      <textarea id='comp-text-input' name='comp-text-input' rows='5' cols='33'
        placeholder='Add Text'  value={text} 
        onChange={(e) => {setText(e.target.value)}}> </textarea>
      <button id='comp-text-btn'  
        type='button' 
        onClick={() => {saveComp(text, 'text', 'comp-input-text')}}>
        Add Text 
      </button>
      <br></br><br></br>
    </article>
    
  )
}

{/* TODO: Replace SaveComp('comp-input-img') input with actual id  */}
function UrlInput({saveComp}) {
  const [url, setUrl] = React.useState('');

  return(
        // TODO: Fix all the tags so there are no repeats

    <article id='comp-input-url' hidden>
      <label htmlFor="componentInput"></label>
      <i className="fa fa-link"></i>
      <input 
        className = 'comp-url-field'
        type="text"  
        placeholder="Paste full website url here"
        onChange={(e) => { setUrl(e.target.value)}}
        value={url} 
      />
      <button type='button' id='comp-url-btn' 
        onClick={() => {saveComp(url, 'url', 'comp-input-url')}}>
        <i className="fa fa-plus"/>
      </button>
    </article>
  )
}

function ImgInput({saveFile}) {
  // const [file, setFile] = React.useState(null);

  return(
        // TODO: Fix all the tags so there are no repeats

    <article id='comp-input-img' hidden>
      <p>
      <i className="fa fa-image"></i>
      Upload an image
      <input id = 'comp-img-input' type = 'file' name = 'comp-img-input' />

      <button id='comp-img-input-btn' type='button' 
        onClick={() => {saveFile('comp-input-img')}}>
        <i className="fa fa-plus"/></button>
      </p>
    </article>
  )
}

