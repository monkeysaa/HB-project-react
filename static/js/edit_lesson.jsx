"use strict";
// 

function CompTemplate(props) {
    return (
      <div className="component">
        <p> {props.title} </p>
        <img src={props.img} />
        <a href={`${props.link}`}> </a>
      </div>
    );
  }

function EditLesson() {
    const [lesson, setLesson] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [comps, setComps] = React.useState([]);
    const [lessonPic, setLessonPic] = React.useState('');
    const [author, setAuthor] = React.useState('')

    // Figure out how to handle these and where to set this up. 
    // const photoDiv = []
    // photoDiv.push(
    //   <button onClick={handleNewPhoto}>Edit Photo</button>;
    // )

    // Do not remove or it will break
    let { lesson_id } = useParams();
  
    React.useEffect(() => {
      fetch(`/api/lessons/${lesson_id}.json`)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            setLesson(data.lesson[0]);
            setAuthor(data.lesson[0].author);
            setComps(data.lesson.slice(1,-1));
            })
    }, []); 
  
    // These features of a lesson can be edited. Handle separately.
    React.useEffect(() => {
      setTitle(lesson.title);
      setLessonPic(lesson.imgUrl);
    //   Add comps here, since they can be edited?
    });
  
    const compCards = [];
  
    for (const comp of comps) {
      compCards.push(
        <CompTemplate
          key={comp.component}
          title={comp.component}
          img={comp.c_img}
          link={comp.c_link}
        />
      );
    }
    
    // const handleNewTitle() {
    //   pass
    // }
    // // const handleNewPhoto() {

      
    // //   if (editPhoto == true) {
    // //     photoDiv.push(
    // //       <form 
    // //         onSubmit={handlePic}
    // //         action='/api/lesson-pic' 
    // //         method='POST' encType='multipart/form-data'>
    // //         <input 
    // //           type="hidden"
    // //           name="lesson_id"
    // //           value={lessonID}
    // //         />
    // //         <input 
    // //           id = 'my-file'
    // //           type='file' name='my-file' /> 
    // //         <input 
    // //           type='submit' 
    // //           />
    // //       </form> 
    // //       )

    // //     }
      
    // // }
    

    return (
      <section className="lesson">
        <div>
          <h3> Editing Lesson {lesson_id}</h3>
        </div>
        {/* <img src={lessonPic}></img>
        {/* <div id="photodiv">{photoDiv}</div> */}
        <h2>{`${title} by ${author}`}</h2>
        {/* <button onClick={handleNewTitle}>Edit Title</button> */}
        <div>{compCards}</div>
      </section>
    );
  }