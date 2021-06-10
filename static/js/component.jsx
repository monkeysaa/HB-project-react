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
  const [url, setUrl] = React.useState('');
  const [imgUrl, setImgUrl] = React.useState('');
  const compsHTML = [];

  // TODO: Remove this loop, as only one place to enter Component. 
  // TODO: On Component display, create a way to delete or move components
  let key = 0;
  for (let comp of inputComps) {
    let param = key
    compsHTML.push(
      <div key={key}>
        <CreateComp url={url} setUrl={setUrl} comps={comps} setComps={setComps}/>
        {/* <button type="button" onClick{() => displayImageInput}> <i className="fa fa-image" /> </button> */}
        <input 
          id = 'comp-pic'
          type = 'file'
          name = 'comp-pic' 
        ></input>
        {/* <button type='button' onClick={() => removeComponent(param)}> <i className="fa fa-trash" /> </button> */}
        <p>Paste a link</p> 
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

function CreateComp({url, setUrl, comps, setComps}) {

  // Saves to Database
  const saveComp = () => {
 
    if(url === "") {
      alert('Update this field before adding.');
    }

    else {
      fetch("/api/create_component", {
        method: "POST",
        body: JSON.stringify({url}),
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        let fetchComps = [...comps];
        fetchComps.push(res);
        setComps(fetchComps);
      })
    }

    document.querySelector(".comp_link").innerHTML = "";
    
  };


  return (
    <React.Fragment>
        <p>Add a New Lesson Component</p>
        <label htmlFor="componentInput"></label>
        <input 
          className="comp_link"
          type="text" 
          placeholder="Paste full website url here"
          onChange={(e) => setUrl(e.target.value)}
          value={url} 
        />
        <button type='button' onClick={saveComp }><i className="fa fa-plus"/></button>


    </React.Fragment>
  )
}

// #*#######################################################################*#
// #*#                          DISPLAY NEW COMPONENT                      #*#
// #*#######################################################################*#
function CompContainer({comps}) {

  const compCards = [];
  
  for (const comp of comps) {
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
        icon_img={comp.icon_img}
        description={comp.description}
      />
    );
  }

  return (
    <div>{compCards}</div>

  );
}

function CompCard(props) {
  // uses props.id, type, url, img

  console.log(props.id);
  const video_id = `comp_video_${props.id}`;
  const img_id = `comp_img_${props.id}`;

  return (
    <section className="component" id={props.id}>
      <h3> <a href={`${props.url}`}> {props.title} </a> </h3>

      {/* will display either img OR iFrame, but not both */}
      <img id={img_id} src={props.img}/> 
      <IFrame props={props} video_id={video_id} img_id={img_id}/>
      <p className='source'><img src={`${props.icon_img}`}/> {props.source}</p>
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


function IFrame({props, video_id, img_id}) {

  React.useEffect(() => {
    if (props.type === 'video' | props.type === 'url') {

      // TODO: if iFrames are disabled, show placeholder image rather than iFrame
      // else... 
      document.getElementById(img_id).setAttribute("hidden", true);
      console.log('test1');
    }
    else {  // handles case of files, etc
      document.getElementById(video_id).innerHTML = "";
      console.log('test2');
    }
  });

  return (
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
  );
}


function TestCompCard(props) {
  const c_link = 'https://www.youtube.com/watch?v=X5EoUD-BIss';
  return (
    <div className="component">
      <p> {props.title} </p>
      <img src={props.img} />
      <a href={c_link}> Superconductors </a>
      <iframe 
          id={props.title} 
          width='560' 
          height='315' 
          src='https://www.youtube.com/embed/X5EoUD-BIss'
          // src={`${props.link}`} 
          title={props.title} 
          frameBorder='0' 
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
          allowFullScreen 
        ></iframe>
    </div>
  );
}

// https://www.youtube.com/watch?v=4mz-dJFkmrk

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


