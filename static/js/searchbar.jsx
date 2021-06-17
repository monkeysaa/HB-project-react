function Searchbar(){
  const history = ReactRouterDOM.useHistory();
  const [searchstring, setSearchstring] = React.useState(""); 

  function processSearch() {
    const search = searchstring
    setSearchstring("");
    history.push(`/search/${search}`);
    // window.location.href = `/api/search/${searchstring}.json`;
    // TODO: --> Route to Search page
  }

  return (
    <form className='searchbar'>
      <input 
        type="text" 
        id="searchstring" 
        onChange={(e) => setSearchstring(e.target.value)}
        value={searchstring} 
        placeholder="Search here..."/>
      <button 
        type="submit" 
        onClick={(e) => {e.preventDefault; processSearch}}>
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}