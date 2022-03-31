import CarpoolItem from "./CarpoolItem";
import { Container } from "react-bootstrap";
import DateBlock from "./DateBlock";

function CarpoolList(props) {
  let CurDate = "";

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
        const date_string = carpool["year"] + "-" + carpool["month"] + "-" + carpool["day"] + "T00:00:00";
        const date = dayOfTheWeek(date_string);
        if (date_string !== CurDate) {
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
