"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function App() {

  return (
    <React.Fragment>
      <CompCase />
    </React.Fragment>
  );
  }

function CompCase ({ headline, onChangeHeadline }) {

  const [title, setTitle] = React.useState('Soon-to-be Title!');

  const handleChange = event => setTitle(event.target.value);

  let collectedTitles = [];
  function addTitle({collectedTitles}) {
    let length = collectedTitles.push(title);
    console.log(`Collected Titles: ${collectedTitles[0]}`);
    console.log(`New length = ${length}`)
  }

  return(
    <div>
    <h1>{headline}</h1>
    {/* <input type="text" value={headline} onChange={onChangeHeadline} /> */}
    <TestComp title={title} handleChange={handleChange}/>
    <button type='button' onClick={addTitle(collectedTitles)}>Add</button> 
  </div>
  );
}


function TestComp({ title, handleChange }) {


  return (
    <React.Fragment>
      <input 
        type="text" 
        placeholder="Test Input"
        onChange={handleChange}
        // onChange={(e) => setTitle(e.target.value)}
        value={title} 
      /> 
      <p>{title}</p>
    </React.Fragment>

  );
}

ReactDOM.render(
  <App />,
  document.getElementById('task'));


 // Old Code Snippets
//   @app.route('/api/update_lesson', methods=["POST"])
// def update_lesson():
//     """Update the database with fresh data."""

//     # JSON from request: {"title": title, "lesson_id": lessonID}

//     data = request.get_json() 
//     new_title = data[0]['title']
//     print(data[0])
//     # print(data[1])
        

//     # try: 
//     #     if lesson_id == "":
//     #         new_lesson = crud.create_lesson(title, session['user_id'])
//     #         print('no lesson_id, created new lesson')
//     #         return {'success': True, 'lesson_id': new_lesson.lesson_id}
//     #     elif type(lesson_id) == int:
//     #         response = crud.update_lesson_title(lesson_id, title)
//     #         print(f'updated lesson {lesson_id}. response: {response}')
//     #         if response == "Success!":
//     #             return {'success': True, 'lesson_id': lesson_id}

//     # except:
//     #     print('Except something done broke')

//     return {'success': True}

// # # Try to combine with above route. For later, maybe turn to RESTful state?
// @app.route('/api/add_pic', methods=['POST']) # This should be PUT? 
// def upload_lesson_image():
//     """Attach imgUrl to lesson in the db, creating new lesson if needed."""

//     # parse data from front-end
//     # save to variable
//     # see if lesson_id exists. Else create new
//     # 

//     my_file = request.files['my-file'] # note: request arg should match name var on form

//     lesson_id = int(request.form['lesson_id'])
//     print(f'in add_pic, just received {my_file} and {lesson_id}')

//     if 'lesson_id' not in request.form:
//         flash('No lesson id found')
//     # If lesson_id passed in and user is author, get lesson. Else, create new.
//     try: 
//         import pdb; pdb.set_trace()
//         lesson = crud.get_lesson_by_id(lesson_id)
//         user = session['user_id']
//         print(lesson.lesson_id, lesson.author.user_id, user)
//         if session['user_id'] != lesson.author.user_id: 
//             lesson = crud.create_lesson('Untitled', session['user_id'])

//     except: 
//     #     # TODO: Nice to have. Change untitled to include date
//         print('except clause')
//         lesson = crud.create_lesson('Untitled', session['user_id'])

//     # TODO: make function handleData() that determines datatype
//     # send to AWS if/when possible
//     # optional: store images in Cloudinary
//     # if video, make sure to return embedded video link for YouTube  

//     # upload image to cloudinary
//     result = cloudinary.uploader.upload(my_file, api_key=CLOUD_KEY, 
//                                         api_secret=CLOUD_SECRET,
//                                         cloud_name='hackbright')

//     try: 
//         imgUrl = result['secure_url']
//         crud.assign_lesson_img(imgUrl, lesson.lesson_id)
//         return {'imgUrl': lesson.imgUrl, 'lesson_id': lesson.lesson_id}
        
//     except: 
//         return {'error': 'Server error'}


// From base.html -- DROPDOWN
// <!-- DON'T DELETE until you've figured out the hover drop-down stuff -->
//     <!-- <nav class="navbar">
//       <a class="navbar-brand" href="/" id="home"><i class="fa fa-home"></i></a>
//       <a class="navbar-brand" id="profile_link"> Profile</a>
//       <a class="navbar-brand" id="lessons_link">Lessons  </a>
//       <a class="navbar-brand" id="users_link">Users</a>
//       <form class="navbar-form form-inline navbar-right">
//         <div class="input-group search-box">
//           <input type="text" id="search" class="form-control"
//           placeholder="Search here...">
//           <span class="input-group-btn">
//             <button type="button" class="btn btn-default">
//               <i class="fa fa-search" style:></i></button>
//           </span>
//         </div>
//       </form>
//       <a data-toggle="dropdown" class="navbar-brand navbar-right" href="#" aria-expanded="true">
//           <i class="fa fa-user-circle"></i>Login</a>
//         <ul class="dropdown-menu">
//           <li>
//             <form class="form-inline login-form" action="/login" method="POST">
//               <div class="input group">
//                 <span class="input-group-addon"><i class="fa fa-user"></i></span>
//                 <input type="text" class="form-control" placeholder="Email" required>
//               </div>
//               <div class="input group">
//                 <span class="input-group-addon"><i class="fa fa-lock"></i></span>
//                 <input type="text" class="form-control" placeholder="Password" required>
//               </div>
//               <button type="submit" class="btn btn-primary">Login</button>
//             </form>
//           </li>
//         </ul>
//         <a href="/signup" class="navbar-brand navbar-right" href="#" aria-expanded="true">
//           <i class="fa fa-user-o"></i>Sign Up</a>
//         </div>
//     </nav> -->

//   function ParamsTest() {
//     // We can use the `useParams` hook here to access
//     // the dynamic pieces of the URL.
//     let { id } = useParams();
//     console.log(`My ID is: ${id}`)
  
//     return (
//       <div>
//         <h3>ID: {id}</h3>
//       </div>
//     );
//   }

//   function CheckLoginStatus(props) {

//     React.useEffect(() => {
//         fetch('/api/check-login-status')
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             setLoggedIn(data);
//         });
//     }, []);

//   }
// COMPONENT STUFF
  // list of all components in this lesson

  // comps = []
  // for (const comp of comps) {
  //   comps.push(
  //     <CompTemplate
  //       key={comp.component}
  //       title={comp.component}
  //       img={comp.c_img}
  //       link={comp.c_link}
  //     />
  //   );
  // }

//   function addComponent() {

//   }

//   function deleteComp() {

//   }
//   // const addComponent() {
//   //   console.log('add component here');
//   // }

//   return (
//     <React.Fragment>
//       <section id="lessonComponent" hidden>
//         <LessonComponent comp_id='1' />
//         {/* <input 
//           id = 'my-component'
//           type='file' 
//           name='comp-file' /> 
//         <input 
//           type='submit' 
//           onClick={addComponent}
//           /> */}
//           {/* Add a plus button that when clicked adds a component */}
//       </section>
//     </React.Fragment>
//   )
// }

  // function unhideComponent() {
  //   // remove hidden attribute on photodiv change features

  //   if (document.getElementById('lessonComponent').hidden) {
  //     document.getElementById('lessonComponent').removeAttribute("hidden");
  //   } 
  //   return 'sad! test no work'
  // }

   // spread operator - triple dot operator takes out els inside array and concats with commas
  // splice operator fruits.splice(2, 1, "Lemon", "Kiwi");   Insert at index 2, Delete 1, Add whateer comes next

  // LESSON CARDS for PROFILE PAGE? 
//   return (
//     <div className="card">
//     <div className="card_body">
//       <img src={props.img} />
//       <iframe width='560' height='315' src={`${props.link}`} title={props.title} frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe> 
//       {/* <h2 className="card_title"></h2> */}
//       <p className={props.text}></p>
//     </div>
//     <button className="card_btn">View Lesson</button>
//   </div>
// );