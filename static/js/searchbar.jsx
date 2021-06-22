function Searchbar(){
  const history = ReactRouterDOM.useHistory();
  const [searchstring, setSearchstring] = React.useState(""); 

  const processSearch = (e) => {
    e.preventDefault()
    console.log(searchstring);
    
    const search = searchstring;
    setSearchstring("");
    history.push(`/search/${search}`);

  };

  return (
    <form className='searchbar'>
      <input 
        type="text" 
        className="searchstring" 
        onChange={(e) => setSearchstring(e.target.value)}
        value={searchstring} 
        placeholder="Search here..."/>
      <button className='search-btn'
        type="button" 
        onClick={processSearch}><i className="fa fa-search"></i>
      </button>
    </form>
  );
}