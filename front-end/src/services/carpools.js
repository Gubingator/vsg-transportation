

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

const FlaskURL2 = 'http://127.0.0.1:5000/'
const FlaskURL = 'https://carpool-flask-api-vsg.azurewebsites.net/';

var config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const axiosInstance = axios.create({
  baseURL: FlaskURL,
});

// Example Data for testing
const initData = [
  {
    id: 1,
    departure: "Hank Circle",
    destination: "Chick-fil-a",
    year: "2022",
    month: "04",
    day: "03",
    time: "4:00:00",
    filled_seats: 2,
  },
  {
    id: 2,
    departure: "EBI Circle",
    destination: "Something",
    year: "2022",
    month: "04",
    day: "02",
    time: "3:00:00",
    filled_seats: 2,
  },
  {
    id: 3,
    departure: "Morgan Circle",
    destination: "Something 2",
    year: "2022",
    month: "04",
    day: "01",
    time: "2:00:00",
    filled_seats: 2,
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
 * @param dispatch  The dispach React Redux object
 * @ param carpool  The new Carpool object to be added
 * @ return the new ID or -1 if error. 
 */
export const NewCarpool = async (dispatch, carpool, email) => {
  try {
    // call adding API

    let data = { ...carpool, 'email': email};

    let result = await axios
      .post(FlaskURL + "carpool", data, config)
      .then(function (response) {
        
        // TODO: 
        const id2 = response["data"]["id"];
        if (id2 < 0){
          return id2;
        }
        let test1 = {
          ...carpool,
          filled_seats: 1,
        };
        const new_obj = { id: id2 };
        const new_data = Object.assign(test1, new_obj);
        dispatch(newCarpool(new_data));
        return id2;
      })
      .catch(function (error) {
        console.log(error);
        return -1;
      });

      return result;
  } catch {
    console.log("New Carpool Error");
    return -1;
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
      .delete(FlaskURL + "delete" + carpool["id"])
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

