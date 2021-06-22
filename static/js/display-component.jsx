// #*#######################################################################*#
// #*#                          Display Saved Components                   #*#
// #*#######################################################################*#

function CompContainer({comps}) {
  // comps is high-level data-container in <NewLesson>
  // CompContainer is the display container  
  // CompCard is the card itself
  // These are used in CreateLesson and SingleLesson
  const compCards = [];

  for (const comp of comps) {
    console.log(`from line within CompContainer Display function, ${comp}`);
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
    <section className='comp-cards-container'>{compCards}</section>
  );
}
  

function CompCard(props) {
  // props: id, type, url, img, text, title, source, favicon, description
  // for videos, will display either img OR iFrame, but not both 

  const video_id = `comp_video_${props.id}`;
  const img_id = `comp_img_${props.id}`;

  return (
    <section className='comp-card-section'>

      <article className="comp-card">
        {(props.type === 'video' || props.type === 'url') &&  
          (<h3> <a href={`${props.url}`}> {props.title} </a> </h3>)}
        {(props.type === 'video') && 
          <IFrame props={props} video_id={video_id} img_id={img_id}/>}
        {(props.type === 'img') && 
          <img className='comp-card-img' src={props.img}/>}
        {(props.source && props.favicon) && <React.Fragment>
          <img className='comp-card-icon' src={`${props.favicon}`}/>
           <p className='comp-card-source'>{props.source}</p>
           </React.Fragment>}
        <p className='comp-card-url'>{props.url}</p>
        {(props.description) && 
          <p className='comp-card-description'>{props.description}</p>}
        {(props.text) && 
          <div className='comp-card-text'>{props.text} </div> }
      </article>


{/* TODO: Build out buttons that trash and reposition this component */}
      <p className='comp-card-btns'> 
        <button 
          className='comp-card-up'
          type='button' 
          onClick={() => console.log('figure out how to move comp')}> 
          ▲
        </button>
        <button 
          className='comp-card-down'
          type='button' 
          onClick={() => console.log('figure out how to move comp')}> 
          ▼
        </button>
        <button 
          type='button' 
          className='comp-card-trash'
          onClick={() => console.log('figure out how to trash comp')}> 
          <i className="fa fa-trash" /> 
        </button>
      </p>

    </section>
  );
}
  

{/* TODO: Look up how to deal with broken links:  */}
function IFrame({props, video_id, img_id}) {

  return (
      <iframe 
        className='comp-card'
        id={`comp-video-${video_id}`}
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