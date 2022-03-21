import { newCarpool, setCarpools, deleteCarpool } from "../store/carpoolsSlice";
import * as axios from "axios";

const FlaskURL = `http://127.0.0.1:5000/`;

var config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const axiosInstance = axios.create({
  baseURL: `http://127.0.0.1:5000/`,
});

const initData = [
  {
    id: 1,
    students: "Student1, Student2",
    location: "Hank Circle",
    year: "2022",
    month: "04",
    day: "03",
    time: "4:00:00",
  },
  {
    id: 2,
    students: "Student3, Student4",
    location: "EBI Circle",
    year: "2022",
    month: "04",
    day: "02",
    time: "3:00:00",
  },
  {
    id: 3,
    students: "Student5, Student6",
    location: "Morgan Circle",
    year: "2022",
    month: "04",
    day: "01",
    time: "2:00:00",
  },
];

export const GetCarpools = async (dispatch) => {
  try {
    // call our api
    const { data } = await axiosInstance.get();
    console.log(data);

    dispatch(setCarpools(data["carpools"]));
  } catch {
    console.log("Get Carpools Error");
  }
};

export const NewCarpool = async (dispatch, carpool) => {
  try {
    // call adding API

    axios
      .post(FlaskURL + "carpool/1", initData[2], config)
      .then(function (response) {
        const id2 = response["data"]["id"];
				let test1 = {
					...initData[2]
				};
				const new_obj = {id: id2};
        const new_data = Object.assign(test1, new_obj);
        dispatch(newCarpool(new_data));
      })
      .catch(function (error) {
        console.log(error);
      });


  } catch {
    console.log("New Carpool Error");
  }
};

export const DeleteCarpool = async (dispatch, carpool) => {
  try {
    // call delete API
    dispatch(deleteCarpool(carpool));
  } catch {
    console.log("Error when Deleting a carpool");
  }
};
