"use strict";

// Page will: 
    // Later: Take in search string if coming from Nav. Either run search and display results or run relative search and display. 
    // Display Search Filters
        // Search input (text)
        // Show search tags applied
        // Remove filters
        // Filter Display
          // Subject tags
          // Grades tags
    // Display matching lessons
        // Show # Matches
        // Code for MultiLessonDisplay --> LessonsCards in profile.jsx


// TODO: Make it work from Nav
        // Show search tags applied
        // Remove filters
        // Filter Display
          // Subject tags
          // Grades tags



function TagFilter(props) {

  const handleToggle = (e) => {
    console.log(`value=${e.target.value}, checked=${e.target.checked}`);
    // if (e.target.checked) {
    //  display a Filter button with e.target.value as text
    // }, 

    // if e.target.checked === false {
        // remove filter button
    // }
  }

  return (
    <li>
      <label>
        <input 
        type="checkbox" 
        name="subject-tag" 
        value={props.name}
        onChange={handleToggle}
        /> 
        {props.name}  
      </label>
    </li>
  );
}

// function BuildButtons...


function ShowFilters({setGrades, setSubjs}){

  const GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
                  '7th', '8th', '9th', '10th', '11th', '12th']
  const SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Social Studies', 
                    'Arts/Music', 'Foreign Lang.']

  React.useEffect(() => {
    setGrades('not yet implemented'); 
    setSubjs('not yet implemented'); 

  }, []);

  const gradeTagsHTML = []
  GRADES.map((grade, index) => {
    gradeTagsHTML.push(<TagFilter key={index} name={grade} checked={false}/>)
  });
 
  
  const subjectTagsHTML = []
  SUBJECTS.map((subject, index) => {
    subjectTagsHTML.push(<TagFilter key={index} name={subject} checked={false}/>)
  });

  return (
    <React.Fragment>
      <section id='grade-filters'>
        <p>Filter by grade</p>
        <ul>  { gradeTagsHTML } </ul>
      </section>
      <section id='subject-filters'>
        <p>Filter by subject</p>
        <ul> { subjectTagsHTML } </ul>
      </section>
    </React.Fragment>

  )
}

function Search() {
  let { params = ' '} = useParams(); // search keyword from Nav-> URL
  // const [tags, setTags] = React.useState([]);
  const [matches, setMatches] = React.useState([]); // array of db_data for matching lessons
  // const [taggedLessons, setTaggedLessons] = React.useState([matches]);
  const [searchstring, setSearchstring] = React.useState(params);
  const [usersearch, setUsersearch] = React.useState('');
  const [searchtype, setSearchtype] = React.useState('searchstring');
  const [keyword, setKeyword] = React.useState(params); // search keyword for displayed results
  const [grades, setGrades] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);


  console.log(`This is line 33: ${searchstring}`);

  const processSearch = () => {
    console.log(`processing Search for: ${searchstring}`);
    const search = {'param': searchstring, 'type': searchtype}

    fetch(`/api/search/${searchstring}`, {
      method: 'POST',
      body: JSON.stringify(search),
      headers: {
          'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
      setSearchstring('');
      console.log(data.lesson_data);
      setKeyword(data.search);
      setMatches(data.lesson_data);
      //let taggedLessons = [];
      //for (const lesson of data.lesson_data) {
      //  for (tag of lesson.tags) {
      //    console.log(tag);
          // taggedLessons.push(tag);
      //   }
      // }
      // setTags(taggedLessons);
    })
  };

  React.useEffect(() => {
    console.log(`This is line 57: ${searchstring}`);
    processSearch();
  }, []);



  const processUserSearch = () => {
    console.log(`processing Search for: ${usersearch}`);
    const search = {'param': usersearch, 'type': searchtype}

    fetch(`/api/search/${usersearch}`, {
      method: 'POST',
      body: JSON.stringify(search),
      headers: {
          'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
      setUsersearch('');
      setKeyword(data.search);
      setMatches(data.lesson_data);
    })
  };

  return (
    <div className='search'>
      {/* FILTERS */}
      <section className='search-parameters'>
      <h1>Lesson Search</h1>
      <section className='parameter-buttons'>
          <p> Current Search Parameters: </p>
          <ul>
            <li>
              {keyword && <button id='keyword-display' type='button'>{keyword}</button>}
            </li>
            
            {/* TODO: for (tag of tags) => build button for tag */}
            {/* {grades && <button id='grades-btn' type='button'>{grades}</button>}
            {subjects && <button id='subjects-btn' type='button'>{subjects}</button>} */}

          </ul>
      </section>

      <section className='search-filter-section'>
        <form className='search-form'>
          <label className='label'>Filter Lessons</label>
          <p>Enter a search term: 
            <input 
              id = 'searchstring'
              type = 'text'
              name = 'query'
              placeholder = 'i.e. Multiplying Fractions'
              onChange={(e) => {setSearchstring(e.target.value); setSearchtype(e.target.id)}}
              value={searchstring}
            />
            <button 
              type="button" 
              onClick={processSearch}>
              <i className="fa fa-search"></i>
            </button>
          </p>
          <p>Enter a username: 
            <input 
              id = 'usersearch'
              type = 'text'
              name = 'query'
              placeholder = 'i.e. alic'
              onChange={(e) => {setUsersearch(e.target.value); setSearchtype(e.target.id)}}
              value={usersearch}
            />
            <button 
              type="button" 
              onClick={processUserSearch}>
              <i className="fa fa-search"></i>
            </button>
          </p>
          <ShowFilters setGrades={setGrades} setSubjs={setSubjects}/>
        </form>
      </section>
      </section>

      {/* RESULTS */}
      <section className='results-display'>
        <p>Results: {matches.length} lessons </p>
        <MultiLessonDisplay lessons={matches} /> 
      </section>
    </div>
  );
}

