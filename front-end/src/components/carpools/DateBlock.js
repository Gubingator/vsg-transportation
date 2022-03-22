import {Row} from "react-bootstrap";


function DateBlock(props){
	return (<Row>
		<h4>{props.dayOfWeek}: {props.month}-{props.day}-{props.year}</h4>
	</Row>);
}

export default DateBlock;