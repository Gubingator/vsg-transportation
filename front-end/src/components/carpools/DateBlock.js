import { Row, Card} from "react-bootstrap";
import classes from "./DateBlock.module.css"

function DateBlock(props) {
  return (
    <Row className={classes.rowData}>
      <Card className={classes.cardData}>
        <h4 className={classes.dateH4}>
          {props.dayOfWeek}: {props.month}-{props.day}-{props.year}
        </h4>
      </Card>
    </Row>
  );
}

export default DateBlock;
