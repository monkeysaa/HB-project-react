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


// TODO: Make it works from Nav
        // Show search tags applied
        // Remove filters
        // Filter Display
          // Subject tags
          // Grades tags

function Search() {
  const [tags, setTags] = React.useState([]);
  const [searchstring, setSearchstring] = React.useState('');
  const [usersearch, setUsersearch] = React.useState('');
  const [matches, setMatches] = React.useState([]); // array of db_data for matching lessons
  const [searchtype, setSearchtype] = React.useState('');
  const [param, setParam] = React.useState('');
  const [userParam, setUserParam] = React.useState('');


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
      console.log(data.lesson_data);
      setParam(data.search);
      setMatches(data.lesson_data);
    })
  };

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
      setUserParam(data.search);
      setMatches(data.lesson_data);
    })
  };

  return (
    <React.Fragment>
      <section className='existing-parameters'>
        {param && <button id='searchstr-btn' type='button'>{searchstring}</button>}
        {userParam && <button id='usersearch-btn' type='button'>{usersearch}</button>}
        {/* TODO: for (tag of tags) => build button for tag */}
        {/* {grades && <button id='grades-btn' type='button'>{grades}</button>}
        {subjects && <button id='subjects-btn' type='button'>{subjects}</button>} */}

      </section>
      {/* FILTERS */}
      <section className='search-filter-section'>
        <h1>Lesson Search</h1>
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
          {/* <ShowFilters tags={tags} setTags={setTags}/> */}
        </form>
        </section>

        <section id='search-filters'>
      <article id='grades'>
        <p>Filter by grade</p>
        {/* <CheckboxContainer />  */}
        {/* {Object.keys(grades).map(key => (
          <input 
            type="checkbox" 
            key={key}
            name={key} 
            onChange={handleToggle}
            checked={grades[key]}
          />
        ))} */}
        {/* <form >
          <input 
            type="checkbox" name="grades" value="4th" checked={isChecked}
            onChange={onCheckboxChange}/>
            <label>4th</label>
          <input type="checkbox" name="grades" value="5th"/><label>5th</label>
          <input type="checkbox" name="grades" value="6th"/><label>6th</label>
        </form>
      </article>
      <article id='subjects'>
        <p>Filter by subject</p>
        <form>
          <input type="checkbox" name="subjects" value="math"/><label>Math</label>
          <input type="checkbox" name="subjects" value="science"/><label>Science</label>
          <input type="checkbox" name="subjects" value="writing"/><label>Writing</label>
        </form> */}
      </article>

      </section>

      {/* RESULTS */}
      <section className='results-display'>
        <p>Results: {matches.length} lessons </p>
        <MultiLessonDisplay lessons={matches} /> 
      </section>
    </React.Fragment>
  );
}



function ShowFilters({tags, setTags}){
  const [grades, setGrades] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);

  function displaySelectedTags() {
  }

  function handleToggle() {
    // setGrades
  }

  return (
    <section id='search-filters'>
      <article id='grades'>
        <p>Filter by grade</p>
        {/* {Object.keys(grades).map(key => (
          <input 
            type="checkbox" 
            key={key}
            name={key} 
            onChange={handleToggle}
            checked={grades[key]}
          />
        ))} */}
        <form onSubmit={handleFilters}>
          <input type="checkbox" name="grades" value="4th"/><label>4th</label>
          <input type="checkbox" name="grades" value="5th"/><label>5th</label>
          <input type="checkbox" name="grades" value="6th"/><label>6th</label>
        </form>
      </article>
      <article id='subjects'>
        <p>Filter by subject</p>
        <form>
          <input type="checkbox" name="subjects" value="math"/><label>Math</label>
          <input type="checkbox" name="subjects" value="science"/><label>Science</label>
          <input type="checkbox" name="subjects" value="writing"/><label>Writing</label>
        </form>
      </article>
    </section>
  )

}