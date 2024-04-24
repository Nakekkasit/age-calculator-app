import { useState } from "react";
import iconArrow from "./images/icon-arrow.svg";

export default function App() {
  const [age, setAge] = useState({
    years: "",
    months: "",
    days: "",
  });

  function calAge(year, month, day) {
    // setAge({ ...age, years: year, months: month, days: day });

    // Get current date
    const currentDate = new Date();

    // Create a new date object with the provided year, month, and day
    const birthDate = new Date(year, month - 1, day); // Month is 0-based

    // Calculate difference in milliseconds between current date and birth date
    const diffMs = currentDate - birthDate;

    // Create a new date object from the difference
    const ageDate = new Date(diffMs);

    // Extract years, months, and days from the age date
    const years = ageDate.getUTCFullYear() - 1970; // Subtract 1970 to get the correct year
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1; // Subtract 1 to account for starting from 1

    // Set the age state with the calculated age
    setAge({ years: years, months: months, days: days });
  }

  return (
    <div className="app">
      <Form calAge={calAge} />
      <Results age={age} />
    </div>
  );
}

function Form({ calAge }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [submit, setSubmit] = useState(false);

  const initialError = {
    date: false,
    month: false,
    year: false,
  };
  const [error, setError] = useState(initialError);

  // Define the maximum number of days for each month
  const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust maxDaysInMonth for February based on leap year
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    maxDaysInMonth[1] = 29; // February (leap year)
  }

  function handleSubmit(e) {
    e.preventDefault();
    const invalid = error.date || error.month || error.year;
    const isInput = day && month && year;
    if (invalid || !isInput) return;
    setSubmit(true);
    calAge(year, month, day);
  }

  function handleChangeDate(e) {
    const value = e.target.value;
    setDay((day) => value);
    // if (submit) setInputDay((inputDay) => value);
    // input validation otherwise shows error message
    /* 1. be a number except ""
         2. > 0
         3. match with selected month    
      */
    // if (!value) setError({ ...initialError, date: false });

    setError({
      ...error,
      date:
        (+value <= 0 && value.length > 0) ||
        (!+value && value.length > 0) ||
        (+month && +value > maxDaysInMonth[+month - 1]),
    });
  }

  function handleChangeMonth(e) {
    const value = e.target.value;
    setMonth(value);
    setError((prevError) => ({
      ...prevError,
      month:
        (+value <= 0 && value.length > 0) ||
        +value > 12 ||
        (!+value && value.length > 0),
      date: +day > maxDaysInMonth[+value - 1],
    }));
  }

  function handleChangeYear(e) {
    const value = e.target.value;
    setYear(value);
    setError({
      ...error,
      year:
        +value > new Date().getFullYear() ||
        (+value <= 0 && value.length > 0) ||
        (!+value && value.length > 0),
      date: +day > maxDaysInMonth[+month - 1],
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__data">
        <div
          className={`form__info form__info--date ${
            error.date || (submit && !day) ? "form__info__error" : ""
          }`}
        >
          <label className="form__label">Day</label>
          <input
            type="text"
            value={day}
            placeholder="DD"
            className="form__input form__input--date"
            onChange={handleChangeDate}
          ></input>
          <p
            className={`error-message ${
              error.date ? "error-message--visible" : "error-message--hidden"
            }`}
          >
            Must be a valid day
          </p>
          <p
            className={`error-empty ${
              submit && !day ? "error-empty--visible" : "error-empty--hidden"
            }`}
          >
            This field is required
          </p>
        </div>
        <div
          className={`form__info form__info--month ${
            error.month || (submit && !month) ? "form__info__error" : ""
          }`}
        >
          <label className="form__label">Month</label>
          <input
            type="text"
            value={month}
            placeholder="MM"
            className="form__input form__input--month"
            onChange={handleChangeMonth}
          ></input>
          <p
            className={`error-message ${
              error.month ? "error-message--visible" : "error-message--hidden"
            }`}
          >
            Must be a valid month
          </p>
          <p
            className={`error-empty ${
              submit && !month ? "error-empty--visible" : "error-empty--hidden"
            }`}
          >
            This field is required
          </p>
        </div>
        <div
          className={`form__info form__info--year ${
            error.year || (submit && !year) ? "form__info__error" : ""
          }`}
        >
          <label className="form__label">Year</label>
          <input
            type="text"
            className="form__input form__input--year"
            value={year}
            placeholder="YYYY"
            onChange={handleChangeYear}
          ></input>
          <p
            className={`error-message ${
              error.year ? "error-message--visible" : "error-message--hidden"
            }`}
          >
            Must be a valid year
          </p>
          <p
            className={`error-empty ${
              submit && !year ? "error-empty--visible" : "error-empty--hidden"
            }`}
          >
            This field is required
          </p>
        </div>
      </div>
      <div className="btn-sec">
        <div className="line"></div>
        <button className="btn">
          <img src={iconArrow} alt="btn icon" />
        </button>
      </div>
    </form>
  );
}

// function Results({ age }) {
//   return (
//     <div className="results">
//       <div className="result">
//         <AnimatedNumber
//           className="result__output result__output--year"
//           value={age.years || 0}
//           formatValue={(value) => value.toFixed(0)}
//         />
//         <span className="result__text">years</span>
//       </div>
//       <div className="result">
//         <AnimatedNumber
//           className="result__output result__output--month"
//           value={age.months || 0}
//           formatValue={(value) => value.toFixed(0)}
//         />
//         <span className="result__text">months</span>
//       </div>
//       <div className="result">
//         <AnimatedNumber
//           className="result__output result__output--day"
//           value={age.days || 0}
//           formatValue={(value) => value.toFixed(0)}
//         />
//         <span className="result__text">days</span>
//       </div>
//     </div>
//   );
// }

function Results({ age }) {
  return (
    <div className="results">
      <div className=" result">
        <p className="result__output result__output--year">
          {age.years ? age.years : "--"}
        </p>
        <span className="result__text">years</span>
      </div>
      <div className=" result">
        <p className="result__output result__output--month">
          {age.months ? age.months : "--"}
        </p>
        <span className="result__text">months</span>
      </div>
      <div className=" result">
        <p className="result__output result__output--day">
          {age.days ? age.days : "--"}
        </p>
        <span className="result__text">days</span>
      </div>
    </div>
  );
}
