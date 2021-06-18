"use strict";

const SUBJECTS = ['Writing', 'Math', 'Science'];
const GRADES = ['4th', '5th', '6th'];

SUBJECTS.map(tagName, index => tagsHTML.push(<Tag key={index} name={tagName}/>));
GRADES.map(tagName, index => tagsHTML.push(<Tag key={index} name={tagName}/>));

// Tag checkboxes
[
  '4th', 
  '5th', 
  '6th',
].map((name) => (
  <p> {name} </p>
));

SUBJECTS.map((name) => (
  <p> {name} </p>
));

function TagFilter(props) {
  
  const handleChange = event => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
    console.log("checkedItems: ", checkedItems);
  };

  return (
    <input 
      type="checkbox" 
      name="subject-tag" 
      checked={checked}
      value={props.name}
      onChange={(e, name, checked) => {console.log(`name=${name}, event= ${e}, value=${e.target.value}, checked=${checked}`)}}> 
      {props.name}
    </input>
  );
}

const CheckboxExample = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const checkboxes = [
    {
      name: "check-box-1",
      key: "checkBox1",
      label: "Check Box 1"
    },
    {
      name: "check-box-2",
      key: "checkBox2",
      label: "Check Box 2"
    }
  ];

  const handleChange = event => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
    console.log("checkedItems: ", checkedItems);
  };

  return (
    <div>
      <lable>Checked item name : {checkedItems["check-box-1"]} </lable> <br />
      {checkboxes.map(item => (
        <label key={item.key}>
          {item.name}
          <Checkbox
            name={item.name}
            checked={checkedItems[item.name]}
            onChange={handleChange}
          />
        </label>
      ))}
    </div>
  );
};





function SubjectTags ({SUBJECTS}) {

  const tagsHTML = [];
  let key = 0;
  for (subj of SUBJECTS) {
    tagsHTML.push(
      <Tag key={key} name={props.tag} />
    );
  }
  key += 1;
}



  return(
    {tagsHTML}
  );
}

function createGradeTags (GRADES) {

}
  GRADES.map((name) => (
    <p> {name} </p>
  ));
}



// function Checkboxes ({ tag, isChecked, onCheckboxChange }) {
//   <div className="checkboxes-form">
//     <label>
//       <input
//         type="checkbox"
//         name={tag}
//         checked={isChecked}
//         onChange={onCheckboxChange}
//         className="checkbox-filter-input"
//       />
//       {tag}
//     </label>
//   </div>
// }


function Checkboxes ({ tag, isChecked, onCheckboxChange }) {
  <div className="checkboxes-form">
    <label>
      <input
        type="checkbox"
        name={tag}
        checked={isChecked}
        onChange={onCheckboxChange}
        className="checkbox-filter-input"
      />
      {tag}
    </label>
  </div>
}

function CheckboxContainer () {
  const SUBJECTS = ['Writing', 'Math', 'Science'];
  const GRADES = ['4th', '5th', '6th'];

  checkboxesHTML = [];
  {for (GRADE of GRADES) {
    checkboxesHTML.push(
      <Checkbox tag={GRADE} isChecked={false} onCheckChange={onCheckboxChange}/>
    )
  }

  return(
    <form>
      {checkboxes}
      <div class='form-group mt-2'>
        <button type='button' class='btn checkbox-delect-btn'>Delect All</button>
        <button type='submit' class='btn checkbox-save-btn'> Save </button>
      </div>
    </form>
  );
}


function TagSearch() {

  deselectAllCheckboxes = (isSelected) => {

  }
}

function handleCheckboxChange (e) => {
  e.preventDefault;
  console.log('');
}




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
</form> */};

    {/* <p>EMBED</p>
    <div style={{width: '560px', height: '315px', float: 'none', clear: 'both', margin: '2px auto'}}>
      <embed
        src={`${props.url}`}
        wmode="transparent"
        type="video/mp4"
        width="100%" height="100%"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title={props.type}
      />
          <p>DIV</p>
    </div>
        <object
        style={{width: "820px", height: "461.25px", float: 'none', "clear": "both", margin: "2px auto"}}
        data={props.url}>
      </object> */}