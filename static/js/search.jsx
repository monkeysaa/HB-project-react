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

// Display Tag checkboxes for user input
function DisplayTagInputs(props){

  const GRADES = ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
                  '7th', '8th', '9th', '10th', '11th', '12th']
  const SUBJECTS = ['Math', 'Writing', 'Reading', 'Science', 'Civics', 
                    'Arts/Music', 'Languages', 'Reasoning']


  const gradeTagsHTML = []
  GRADES.map((grade, index) => {
    gradeTagsHTML.push(<TagInput key={index} name={grade} setTags={props.setTags}/>)
  });

  const subjectTagsHTML = []
  SUBJECTS.map((subject, index) => {
    subjectTagsHTML.push(<TagInput key={index} name={subject} setTags={props.setTags}/>)
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

// Tag template. Set state var "tags" here when checked.
function TagInput(props) {

  const applyTag = () => {
    const tagsArray = [];
      const tagEls = document.querySelectorAll('input[type="checkbox"]:checked');
      
      for (const tag of tagEls) {
        tagsArray.push(tag.value);
      } 
      props.setTags(tagsArray);
  };

  // React.useEffect(() => {
  //   props.setTags(tagsArray);
  // }, [tagsArray]);


  return (
    <li>
      <label>
        <input 
        type="checkbox" 
        name="subject-tag" 
        value={props.name}
        onChange={applyTag}
        /> 
        {`\xa0${props.name}`}  
      </label>
    </li>
  );
}


function Search() {
  let { params = ''} = useParams(); // search keyword from Nav-> URL
  const [matches, setMatches] = React.useState([]); // array of db_data for matching lessons
  const [filteredMatches, setFilteredMatches] = React.useState([]);
  const [searchstring, setSearchstring] = React.useState(params);
  const [tags, setTags] = React.useState([]);
  const [searchtype, setSearchtype] = React.useState('searchstring');
  const [keywords, setKeywords] = React.useState([params]); // search keyword for displayed results

  // process search given URL parameters
  React.useEffect(() => {
    processSearch();
  }, []);

  // Apply filter to the original search
  React.useEffect(() => {
    if (tags.length == 0) {
        setFilteredMatches(matches);
        return;
    } 

    // TODO: Optimize for efficiency later. Binary search? Tree? 
    const refinedMatches = new Set();
    for (let lesson of matches) {
      for (let tag of lesson.tags) {
        if (tags.includes(tag.name)) {
          refinedMatches.add(lesson);
        }
      }
    }
    setFilteredMatches(refinedMatches);
  }, [tags, matches]);

  // Process the original search
  const processSearch = () => {
    console.log(`processing Search for: ${searchstring}`);
    const search = {'param': searchstring}

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
      let key=0;
      for (const keyword of data.search) {
        keywordsHTML.push(<Button key={key} keyword={`${keyword}  `}/>);
        key+=1;
      }
      setKeywords(keywordsHTML);

      // identifies lesson matches
      setMatches(data.lesson_data);
      // tags ? applyFilters(tags, matches, setMatches) : null;

    })
    .catch(err => {console.log(err);})
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
          <DisplayTagInputs setTags={setTags}/>
          {/* <DisplayTagInputs setTags={setTags}/> */}
        </form>
      </section>
      </section>

      {/* RESULTS */}
      <section className='results-display'>
        {(filteredMatches.length !== 1) && <p>Results: {filteredMatches.length} lessons </p>}
        {(filteredMatches.length === 1) && <p>Results: {filteredMatches.length} lesson </p>}
        <MultiLessonDisplay lessons={filteredMatches} spec='wide'/> 
      </section>
    </div>
  );
}

