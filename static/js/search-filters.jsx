"use strict";

const SUBJECTS = ['Writing', 'Math', 'Science'];
const GRADES = ['4th', '5th', '6th'];

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

const handleCheckboxChange = (e) => {
  
}


