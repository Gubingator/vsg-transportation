import CarpoolItem from "./CarpoolItem";
import { Container } from "react-bootstrap";
import DateBlock from "./DateBlock";

function CarpoolList(props) {
  let CurDate = "";

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

  return (
    <Container>
      {props.carpoolList.map((carpool) => {
        let update = false;
        // get the date string
        const date_string = carpool["year"] + "-" + carpool["month"] + "-" + carpool["day"] + "T00:00:00";
        const date = dayOfTheWeek(date_string); // get the day of the week
        if (date_string !== CurDate) { // if we are at a new date, then we will create a DateBlock
          CurDate = date_string;
          update = true;
        }
        return (
          <div key={carpool.id}>
            {update ? (
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
