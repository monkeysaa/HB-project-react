"use strict";

const Router = ReactRouterDOM.BrowserRouter;
const { useHistory, useParams, Redirect, Switch, Prompt, Link, Route, useLocation } = ReactRouterDOM;

function App() {
  
    return (
      <UserLogin />
    );
  }

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

ReactDOM.render(
    <App />,
    document.getElementById('task'));