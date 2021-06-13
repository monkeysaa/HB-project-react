"use strict";

const SUBJECTS = ['Writing', 'Math', 'Science'];
const GRADES = ['4th', '5th', '6th'];

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

function TagSearch() {

  deselectAllCheckboxes = (isSelected) => {

  }
}

const handleCheckboxChange = (e) => {
  
}


