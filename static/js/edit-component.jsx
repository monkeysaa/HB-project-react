function CompContainer() {
    const [compDataCards, setCompDataCards] = React.useState([]);
    // hold data for each lesson
  
    // function addCard()
      // takes in lesson_data: ID, title, author, imgUrl, type, img(if video), array of tags
      // 1 'Wolves' 'author" "/static/img/grey_wolves.png", ['Science', '4th', '5th']
    
    // Add data to the collection of search results
    function addCard(lessonId, title, imgUrl) {
      const lessonCard = { lessonId, title, imgUrl: null}; // dataCard to be added
      const currentCards = [...lessonDataCards]; // helper array to allow adding a dataCard
      setCards([...currentCards, lessonCard]); // add dataCard
    }
  
    // set cards
    React.useEffect(() => {
      fetch('/api/search')
        .then((response) => response.json())
        .then((data) => setCards(data.cards));
    }, []);
  
    const lessonCards = []; 
  
    for (const currentCard of cards) {
      componentCards.push(
        <LessonCard
          key={currentCard.cardId}
          title={currentCard.title}
          imgUrl={currentCard.imgUrl}
        />
      );
    }
  
    return (
      <React.Fragment>
        <AddTradingCard addCard={addCard} />
        <h2> Search Results </h2> 
        <div>{componentCards}</div> 
      </React.Fragment>
    );
  }