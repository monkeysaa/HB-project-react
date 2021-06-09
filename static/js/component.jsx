// const { checkPropTypes } = require("prop-types");

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


// Nice to have: Create cards for Components to drag them around. 
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
        {/* <button type='button' onClick={() => removeComponent(param)}> <i className="fa fa-trash" /> </button> */}
        <p>Paste a link</p> 
      </div>
    );
    key += 1;
  }

  
// #*########################################################################*#
// #*#                      Display an Additional Input Component         #*#
// #*########################################################################*#

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
  const [tempComps, setTempComps] = React.useState([]);

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
        let fetchComps = [...comps];
        fetchComps.push(res);
        setComps(fetchComps);
      })
    }
    
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
        <button type='button' onClick={saveComp }><i className="fa fa-check-circle"/></button>


    </React.Fragment>
  )
}

// #*#######################################################################*#
// #*#                          DISPLAY SAVED COMPONENT                    #*#
// #*#######################################################################*#
// function CompCard(props) {

//   const videoElement = `comp_card_${props.id}`;

//   if (props.type == 'video') {
//     document.getElementById(videoElement).removeAttribute("hidden");
//     console.log('is video');
//   }

//   return (
//     <div className="component-card">
//       <img src={props.img} />
//       <iframe 
//         id={`comp_card_${props.id}`} 
//         width='560' height='315' 
//         src={`${props.link}`} 
//         title={props.title} 
//         frameBorder='0' 
//         allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
//         allowFullScreen 
//         hidden>
//       </iframe> 
//       <p> <a href={`${props.link}`}> {`${props.type}`} </a> </p>
//       <p className={props.text}></p>
//     </div>
//   );
// }

function VidFrame({props, video_id, img_id}) {
  console.log(props.url, props.type, props.id);
  console.log(img_id, video_id);


  React.useEffect(() => {
    if (props.type === 'video') {
      document.getElementById(img_id).setAttribute("hidden", true);
      console.log('test1');
    }
    else {
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

function CompCard(props) {
  // uses props.id, type, url, img

  console.log(props.id);
  const video_id = `comp_video_${props.id}`;
  const img_id = `comp_img_${props.id}`;

  return (
    <div className="component" id={props.id}>
      <p> <a href={`${props.url}`}> {props.type} </a> </p>
      <img id={img_id} src={props.img} />
      <VidFrame props={props} video_id={video_id} img_id={img_id}/>
    </div>
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


// function LessonComponent({props, lessonID}) {
//     const [id, setID] = React.useState(null); // This will tell us whether or not it exists in DB
    
//     const components = [];

//     for (comp of comps) {
//       let param = key;
//       if (id) {
//         components.push(
//           <DisplaySavedComps lessonID = {lessonID} />
//         );
//       }
//       components.push(
//         <CompTemplate 
//           key={key}
//           link={comp.url}
//         />
//       );
//       key += 1;

//     }


//     return (
//       <React.Fragment>
//         <div>Lesson Components</div>
//         <div> { components } </div>
//         {/* <iframe width='560' height='315' src='https://player.pbs.org/viralplayer/3054932177/' title='YouTube video player' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe> */}
//       </React.Fragment>
//     );

// }

  // function CompListItem(props) {
  //   return  <p> <a href={`${props.link}`}> {props.link} </a> </p>
  
  // }

  // function CompList(props) {
  //   const [compList, setCompList] = React.useState([]);


// Component Lifecycle: 
// Creation: User uploads text or files. 
// OR User makes use of someone else's component by favoriting. 

// NewComponent. If it doesn't exist...  Has button to save to DB. 
// Component. If it's in the database, need a call to DB to get info, and then 
//             either a display or we'll just need it to be present / accessible


// Double Linked List  
//   Generate ids to CreateLessonComps section eg. lowercase --> uppercase alphabet
//   Nodes correspond div ids or sections ids "a-display", "a-input"
//   Each node will have an ID, a type, the data of the component. 
//       handling files: https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
//