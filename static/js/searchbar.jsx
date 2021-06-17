function Searchbar(){
  const history = ReactRouterDOM.useHistory();
  const [searchstring, setSearchstring] = React.useState(""); 

  function processSearch() {
    const search = searchstring
    setSearchstring("");
    history.push(`/search/${search}`);

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
        type="button" 
        onClick={processSearch}>
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}