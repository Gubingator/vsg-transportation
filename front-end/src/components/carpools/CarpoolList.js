/* Group Number: 5
 * Members: Sarah Zhang, Katie Cella, Bing Gu, Ethan Piper
 * sarah.s.zhang@vanderbilt.edu, katharine.a.cella@vanderbilt.edu, bing.q.gu@vanderbilt.edu, ethan.b.piper@vanderbilt.edu
 * Homework 03
 */

import CarpoolItem from "./CarpoolItem";
import { Container } from "react-bootstrap";
import DateBlock from "./DateBlock";
import { useState, useEffect } from "react";

function CarpoolList(props) {
  let CurDate = "";
  const [option, setOption] = useState("");
  const [TheDate, setDate] = useState("");
  const [Departure, setDeparture] = useState("");
  const [Destination, setDestination] = useState("");

  //this 3 variables are when user click search 
  const [realDate, changeDate] = useState("");
  const [realDeparture, changeDeparture] = useState("");
  const [realDestination, changeDestination] = useState("");


  /* Returns the string day of the week for a specific day.
   *
   * @param date_string The string date in the form of year-month-dayT00:00:00
   * @return the String full day of the week
   */
  function dayOfTheWeek(date_string) {
    const date = new Date(date_string);
    const dayOfTheWeek = date.getDay();

    if (dayOfTheWeek === 0) {
      return "Sunday";
    } else if (dayOfTheWeek === 1) {
      return "Monday";
    } else if (dayOfTheWeek === 2) {
      return "Tuesday";
    } else if (dayOfTheWeek === 3) {
      return "Wednesday";
    } else if (dayOfTheWeek === 4) {
      return "Thursday";
    } else if (dayOfTheWeek === 5) {
      return "Friday";
    } else if (dayOfTheWeek === 6) {
      return "Saturday";
    }
  }

  function handleSubmit(event) {
    alert('The FRIENDS character you are most like is: ' + this.state.value);
    event.preventDefault();
  }

  function handleOptions(){
    if(option === "Date"){
      return(<div>
        <input
            type="date"
            required
            onChange={(event) => {
              setDate(event.target.value);
              setDestination("");
              setDeparture("");
            }}
          />
        </div>)
    }
    else if(option === "Departure"){
      return(
      <input
      type="text"
      required
      maxLength="20"
      onChange={(event) => {
        setDeparture(event.target.value);
        setDate("");
        setDestination("");
      }}
    />)
    }
    else if(option === "Destination"){
      return (<input
      type="text"
      required
      maxLength="20"
      onChange={(event) => {
        setDestination(event.target.value);
        setDate("");
        setDeparture("");
      }}
    />)
    }
  }

  function changeInput(e){
    e.preventDefault();

    console.log(TheDate);
    console.log(Destination);
    console.log(Departure);

    console.log(realDate);
    console.log(realDestination);
    console.log(realDeparture);

    changeDate(TheDate);
    changeDeparture(Departure);
    changeDestination(Destination);

    // if (option === "Date"){
    //   setDeparture("");
    //   setDestination("");
    // } else if (option === "Destination"){
    //   setDate("");
    //   setDeparture("");
    // } else if (option === "Departure"){
    //   setDate("");
    //   setDestination("");
    // }

    console.log(realDate);
    console.log(realDestination);
    console.log(realDeparture);
    console.log("------------------------")
  }

  function reset(e){
    e.preventDefault();

    changeDate("");
    changeDeparture("");
    changeDestination("");
  }

  return (
    <Container style={{ paddingTop: "10px" }}>

      <h1
        style={{
          fontFamily: "Montserrat",
          fontSize: "24pt",
          fontWeight: "bold",
        }}
      >
        Search:
      </h1>

      <form>
        <label>
          Search By: 
          <select onChange={(event) => {
                        setOption(event.target.value);
                      }}>
            <option selected value="none">Select an Option</option>
            <option value="Date">Date</option>
            <option value="Departure">Departure Location</option>
            <option value="Destination">Destination</option>
          </select>
        </label>
        {handleOptions()}

         <button
            //type="submit"
            onClick={changeInput}
          >
            Search
          </button>
          
          <button
            //type="submit"
            onClick={reset}
          >
            Reset Search
          </button>
      </form>

      <h2
        style={{
          fontFamily: "Montserrat",
          fontSize: "24pt",
          fontWeight: "bold",
        }}
      >
        AVAILABLE CARPOOLS
      </h2>

      {props.carpoolList.filter((carpool) => {
        if (String(realDate) !== "" && 
        (carpool["year"] + "-" + carpool["month"] + "-" + carpool["day"]) === String(realDate)){
          return true;
        }
        else if(String(realDeparture) !== "" && carpool["departure"].toLowerCase() === String(realDeparture).toLowerCase()){
          return true;
        }
        else if(String(realDestination) !== "" && carpool["destination"].toLowerCase() === String(realDestination).toLowerCase()){
          return true;
        }
        else if(String(realDestination) === "" && String(realDeparture) === "" && String(realDate) === ""){
          return true;
        }
        else{
          console.log("else");
            
          return false;
        }
        
      }).map((carpool) => {
        let update = false;
        // get the date string
        const date_string =
          carpool["year"] +
          "-" +
          carpool["month"] +
          "-" +
          carpool["day"] +
          "T00:00:00";
        const date = dayOfTheWeek(date_string); // get the day of the week
        if (date_string !== CurDate) {
          // if we are at a new date, then we will create a DateBlock
          CurDate = date_string;
          update = true;
        }
        return (
          <div key={carpool.id}>
            {update ? ( // add a new date block if we are supposed to.
              <DateBlock
                dayOfWeek={date}
                year={carpool["year"]}
                month={carpool["month"]}
                day={carpool["day"]}
                syle={{ fontFamily: "Open Sans" }}
              />
            ) : (
              <div></div>
            )}
            <CarpoolItem carpool_ref={carpool} />
          </div>
        );
      })}
    </Container>
  );
}

export default CarpoolList;
