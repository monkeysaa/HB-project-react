// const { checkPropTypes } = require("prop-types");

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


function ComponentInputCase({comps, setComps}) {
  const [inputComps, setInputComps] = React.useState([0]);
  const compsHTML = [];

  // TODO: Remove this loop, as only one place to enter Component. 
  // TODO: On Component display, create a way to delete or move components
  let key = 0;
  for (let comp of inputComps) {
    let param = key
    compsHTML.push(
      <div key={key}>
        <CreateComp comps={comps} setComps={setComps}/>
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

function CreateComp({comps, setComps}) {
  const [url, setUrl] = React.useState('');
  const [compType, setCompType] = React.useState('');
  const [text, setText] = React.useState('');

  const saveComp = () => {

    const requestBody = {};
    console.log("Hitting this line (83)");

    if (compType === 'url') {
      if (url === '') {
        alert('Update this field before adding.');
      }
      requestBody.url = url;
    } 
    else if (compType === 'img') {
      const file = document.getElementById('comp-pic').files[0];
      requestBody.compPic = file;
    }
    else if (compType === 'text') {
      requestBody.text = text;
    }

    fetch('/api/create_component/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(({comp}) => { // Destructures response and gives only value of 'comp' key
      console.log(comp);
      // Use ... whenever you update a state array. 
      setComps(currentComps => [...currentComps, comp]); // give it a function and the argument is teh current value of the state
    })

  };

  return (
    <React.Fragment>
        <p>Add a New Lesson Component</p>
        <label htmlFor="componentInput"></label>
        <i className="fa fa-link"></i>
        <input 
          id = 'comp_url'
          type="text" 
          placeholder="Paste full website url here"
          onChange={(e) => { setUrl(e.target.value); setCompType('url') }}
          value={url} 
        />
        <button type='button' onClick={ saveComp }>
          <i className="fa fa-plus"/></button>
{/* if file upload functionality: <i className="fa-solid fa-image"></i>*/}
        <p>
          <i className="fa fa-image"></i>
          Upload an image
          <input id = 'comp_pic' type = 'file' name = 'comp_pic' 
           onChange={() => { setCompType('img') }}/>
          <button id='comp-pic-btn' type='button' onClick={ saveComp }>
            <i className="fa fa-plus"/></button>
        </p>
          <label id='comp_text' htmlFor='comp_text' name='comp_text'>Add Text:</label>
          <textarea id='comp_text' name='comp_text' rows='5' cols='33'
          placeholder='Add Text'  value={text} 
          onChange={(e) => {setText(e.target.value); setCompType('text')}}> </textarea>
          <button id='comp-text-btn'  type='button' onClick={ saveComp }>Add Text </button>
        <br></br>
        <br></br>

    </React.Fragment>
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

  // CREATE COMP OUTTAKES
  // const saveUrl = () => {
 
  //   if(url === "") {
  //     alert('Update this field before adding.');
  //   }

  //   else {
  //     const data = {'url': url, 'type': 'url'}

  //     fetch(/api/create_component/", {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //     })
  //     .then(response => response.json())
  //     .then(res => {
  //       console.log(res);
  //       let fetchComps = [...comps];
  //       fetchComps.push(res);
  //       setComps(fetchComps);
  //     })
  //   }

  // };
  // const addText = () => {
  //   setCompType('text');
  //   const textHTML = [
  //     <Text text={text} setText={setText}/>
  //   ];
  // }

// #*#######################################################################*#
// #*#                          DISPLAY NEW COMPONENT                      #*#
// #*#######################################################################*#
function CompContainer({comps}) {
  // comps is data-container 
  // compCards is temp display-container
  // CompCard is the template for display
  const compCards = [];
  console.log(comps);

  for (const comp of comps) {
    console.log(comp);
    compCards.push(
      <CompCard
        key={comp.id}
        id={comp.id}
        type={comp.type}
        url={comp.url} // e.g. link or embedded video link
        img={comp.imgUrl} // e.g. thumbnail or image link from Cloudinary
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
    <section className="component" id={props.id}>
      <h3> <a href={`${props.url}`}> {props.title} </a> </h3>

      {/* will display either img OR iFrame, but not both */}

      {(props.type === 'video' || props.type === 'url') ?  
        <IFrame props={props} video_id={video_id} img_id={img_id}/> :
        <img id={img_id} src={props.img}/> 
      }
      <p className='source'><img src={`${props.favicon}`}/> {props.source}</p>
      <p> {props.description} </p>
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

  React.useEffect(() => {
    // if ((props.type === 'video') | (!(props.id === 5) && !(props.id === 10) )){

    //   document.getElementById(img_id).setAttribute("hidden", true);
    //   // console.log('test1');
    // }
    // else {  // handles case of files, etc
    //   document.getElementById(video_id).innerHTML = "";
    //   // console.log('test2');
    // }
  });

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
    {/* <p>EMBED</p>
    <div style={{width: '560px', height: '315px', float: 'none', clear: 'both', margin: '2px auto'}}>
      <embed
        src={`${props.url}`}
        wmode="transparent"
        type="video/mp4"
        width="100%" height="100%"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title={props.type}
      />
          <p>DIV</p>
    </div>
        <object
        style={{width: "820px", height: "461.25px", float: 'none', "clear": "both", margin: "2px auto"}}
        data={props.url}>
      </object> */}
    </React.Fragment>
 
  );
}


// #*#######################################################################*#
// #*#                          Display Saved Components                   #*#
// #*#######################################################################*#
function DisplaySavedComps(props, lessonID) {
  const [dbComps, setDbComps] = React.useState([]);
  const comps = [];

  React.useEffect(() => {
  fetch(`/api/get_comps/${props.lesson_id}`) 
  // endpoint for retrieving all lesson components from DB, using lesson_id. 
  .then((response) => response.json())
  .then((data) => {
    if (data) {
      setDbComps(data[0]);
      console.log(data[0]);
    }
    })
  }, [])

  for (const [comp, value] of Object.entries(dbComps)) {
    comps.push(
      <div>
        <p>BOOOO, We are here :(</p>
      <CompCard
        key={value.comp_id}
        // title={comp.component}
        img={value.imgUrl}
        url={value.url}
      />
      </div>

    );
  }
}


