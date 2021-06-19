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

function SearchParam(props) {
  return(
    <button className='keywords-display' type='button'>{props.keyword}✖️</button>
  );
}

function TagFilter(props) {

  const handleToggle = (e) => {
    console.log(`value=${e.target.value}, checked=${e.target.checked}`);
    // if (e.target.checked) {
    //  display a Filter button with e.target.value as text
    // }, 
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
        {`\xa0${props.name}`}  
      </label>
    </li>
  );
}

// function BuildButtons...


function ShowTags({setGrades = null, setSubjs = null}){

  const GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
                  '7th', '8th', '9th', '10th', '11th', '12th']
  const SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Social Studies', 
                    'Arts/Music', 'Languages', 'Critical Thinking']

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
        <p className='filter-label'>GRADE</p>
        <ul id='grade-tags'>  { gradeTagsHTML } </ul>
      </section>
      <section id='subject-filters'>
        <p className='filter-label'>SUBJECT</p>
        <ul id='subject-tags'> { subjectTagsHTML } </ul>
      </section>
    </React.Fragment>

  )
}

function Search() {
  let { params = ''} = useParams(); // search keyword from Nav-> URL
  // const [tags, setTags] = React.useState([]);
  const [matches, setMatches] = React.useState([]); // array of db_data for matching lessons
  // const [taggedLessons, setTaggedLessons] = React.useState([matches]);
  const [searchstring, setSearchstring] = React.useState(params);
  const [usersearch, setUsersearch] = React.useState('');
  const [searchtype, setSearchtype] = React.useState('searchstring');
  const [keywords, setKeywords] = React.useState([params]); // search keyword for displayed results
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
      setKeywords(data.search);
      console.log(data.search);
      const keywordsHTML = [];
      for (const keyword of data.search) {
        keywordsHTML.push(<SearchParam keyword={`${keyword}  `}/>);
      }
      console.log(keywordsHTML);
      setKeywords(keywordsHTML);
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

  // const processUserSearch = () => {
  //   console.log(`processing Search for: ${usersearch}`);
  //   const search = {'param': usersearch, 'type': searchtype}

  //   fetch(`/api/search/${usersearch}`, {
  //     method: 'POST',
  //     body: JSON.stringify(search),
  //     headers: {
  //         'Content-Type': 'application/json'
  //       },
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     setUsersearch('');
  //     setKeywords(data.search);
  //     setMatches(data.lesson_data);
  //   })
  // };

  return (
    <div className='search'>
      {/* FILTERS */}
      <section className='search-display'>
      <section className='parameter-buttons'>
          <p className='search-heading'> Searching for...</p>
          <ul className='search-keywords'>
            <li>
              {keywords}
            </li>
            
            {/* TODO: for (tag of tags) => build button for tag */}
            {/* {grades && <button id='grades-btn' type='button'>{grades}</button>}
            {subjects && <button id='subjects-btn' type='button'>{subjects}</button>} */}

          </ul>
      </section>

      <section className='search-filter-section'>
        <form className='search-form'>
            <p> Search by keyword or username: </p>
            <input 
              id = 'searchstring'
              type = 'text'
              name = 'query'
              placeholder = 'i.e. fractions or alic'
              onChange={(e) => {setSearchstring(e.target.value); setSearchtype(e.target.id)}}
              value={searchstring}
            />
            <Link to={`/search/${searchstring}`}>
              <button className='search-btn'
                type="button" 
                onClick={processSearch}>
                <i className="fa fa-search"></i>
              </button></Link>
 
            {/* <p> Search by user: </p>
            <input 
              id = 'usersearch'
              type = 'text'
              name = 'query'
              placeholder = 'by user, i.e. user0'
              onChange={(e) => {setUsersearch(e.target.value); setSearchtype(e.target.id)}}
              value={usersearch}
            />
            <button className='search-btn'
              type="button" 
              onClick={processUserSearch}>
              <i className="fa fa-search"></i>
            </button><br></br> */}
          <label className='label'>Filter Lessons</label>
          <ShowTags setGrades={setGrades} setSubjs={setSubjects}/>
        </form>
      </section>
      </section>

      {/* RESULTS */}
      <section className='results-display'>
        {(matches.length !== 1) && <p>Results: {matches.length} lessons </p>}
        {(matches.length === 1) && <p>Results: {matches.length} lesson </p>}
        <MultiLessonDisplay lessons={matches} spec='wide'/> 
      </section>
    </div>
  );
}

