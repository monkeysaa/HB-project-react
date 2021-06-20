"use strict";

// Page will: 
    // Take in search string if coming from Nav. 
    // Run search and display resulting lessons
    // Filter search and display resulting lessons 
        // Show search options, including subj and grade checkboxes
        // Show search tags applied (as removable buttons)
        // Show filter tags applied (as removable buttons)
        // Show num lessons and wide lesson cards for each match


// Displays user search keywords and selected filters 
function Button(props) {
  return(
    <button className='keywords-display' type='button'>{props.keyword}✖️</button>
  );
}


// Tag template
function TagInput(props) {

  return (
    <li>
      <label>
        <input 
        type="checkbox" 
        name="subject-tag" 
        value={props.name}
        /> 
        {`\xa0${props.name}`}  
      </label>
    </li>
  );
}


// Display Tag checkboxes for user input
function DisplayTagInputs(){

  const GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
                  '7th', '8th', '9th', '10th', '11th', '12th']
  const SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Civics', 
                    'Arts/Music', 'Languages', 'Reasoning']


  const gradeTagsHTML = []
  GRADES.map((grade, index) => {
    gradeTagsHTML.push(<TagInput key={index} name={grade} checked={false}/>)
  });

  const subjectTagsHTML = []
  SUBJECTS.map((subject, index) => {
    subjectTagsHTML.push(<TagInput key={index} name={subject} checked={false}/>)
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
  const [tags, setTags] = React.useState([]);
  const [matches, setMatches] = React.useState([]); // array of db_data for matching lessons
  const [searchstring, setSearchstring] = React.useState(params);
  const [searchtype, setSearchtype] = React.useState('searchstring');
  const [keywords, setKeywords] = React.useState([params]); // search keyword for displayed results

  console.log(`This is line 33: ${searchstring}`);

  // process search given URL parameters
  React.useEffect(() => {
    processSearch();
  }, []);

  // Apply filter for each box checked
  React.useEffect(() => {
    const tagsArray = []
    debugger;
    const tagEls = document.querySelectorAll('input[type="checkbox"]:checked')
    for (const tag of tagEls) {
      tagsArray.push(tag.value);
    } 
    setTags(tagsArray);
  }, [document.querySelectorAll('input[type="checkbox"]:checked')]);


  // Apply filter to the original search
  React.useEffect(() => {
    const refinedMatches = []
    for (let lesson of matches) {
      for (let tag of lesson.tags) {
        if (tag in tags) {
          refinedMatches.push(lesson);
        }
      }
    }
    setMatches(refinedMatches);
  }, [tags, matches]);

  // Process the original search
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

      // resets search input to blank
      setSearchstring('');

      // build buttons displaying search terms to user
      const keywordsHTML = [];
      for (const keyword of data.search) {
        keywordsHTML.push(<Button keyword={`${keyword}  `}/>);
      }
      setKeywords(keywordsHTML);

      // identifies lesson matches
      setMatches(data.lesson_data);
      tags ? applyFilters(tags, matches, setMatches) : null;

    })
  };


  return (
    <div className='search'>
      <section className='search-display'>
      <section className='parameter-buttons'>
          <p className='search-heading'> Searching for...</p>
          <ul className='search-keywords'>
            <li>
              {keywords}
              {}
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
          <DisplayTagInputs />
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

