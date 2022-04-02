/*
 * This file includes all information around handling the carpool data.
 */

import {
  newCarpool,
  setCarpools,
  deleteCarpool,
  updateCarpool,
} from "../store/carpoolsSlice";
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

// Example Data for testing
const initData = [
  {
    id: 1,
    students: ["Student1", "Student2"],
    departure: "Hank Circle",
    destination: "Chick-fil-a",
    year: "2022",
    month: "04",
    day: "03",
    time: "4:00:00",
  },
  {
    id: 2,
    students: ["Student3", "Student4"],
    departure: "EBI Circle",
    destination: "Something",
    year: "2022",
    month: "04",
    day: "02",
    time: "3:00:00",
  },
  {
    id: 3,
    students: ["Student3", "Student4"],
    departure: "Morgan Circle",
    destination: "Something 2",
    year: "2022",
    month: "04",
    day: "01",
    time: "2:00:00",
  },
];

/*
 * Get all the carpools in the database and load them into the store
 * @param dispatch  The dispact React Redux object
 */
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

/*
 * Add a New Carpool to the database
 *
 * @param dispatch  The dispact React Redux object
 * @ param carpool  The new Carpool object to be added
 */
export const NewCarpool = async (dispatch, carpool) => {
  try {
    // call adding API

    axios
      .post(FlaskURL + "carpool/1", carpool, config)
      .then(function (response) {
        const id2 = response["data"]["id"];
        let test1 = {
          ...carpool,
        };
        const new_obj = { id: id2 };
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

/*
 * Delete a carpool from the database
 *
 * @param dispatch  The dispact React Redux object
 * @param carpool   The carpool object to be deleted
 */
export const DeleteCarpool = async (dispatch, carpool) => {
  try {
    // call delete API
    axios
      .delete(FlaskURL + "delete/" + carpool["id"])
      .then(function (response) {
        dispatch(deleteCarpool(carpool));
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch {
    console.log("Error when Deleting a carpool");
  }
};

/*
 * Update a specific carpool in the database
 *
 * @param dispatch    The dispact React Redux object
 * @param carpool_id  The id of the carpool to be set
 * @param carpool     The carpool to be set to
 */
export const UpdateCarpool = async (dispatch, carpool_id, new_student) => {
  try {
    // call api
    const toSend = { newStudent: new_student };

    axios
      .post(FlaskURL + "carpool/join/" + carpool_id, toSend, config)
      .then(function (response) {
        // get the new data
        const new_data = response["data"]["carpool"];
        dispatch(updateCarpool(new_data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // update capools
  } catch {
    console.log("Error when Updating Carpool");
  }
};
