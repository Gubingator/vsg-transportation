/*
 * This file implements all of the verification services needed
 * to verify the vanderbilt email addresses of students.
 */

import * as axios from "axios";

const FlaskURL2 = `http://127.0.0.1:5000/`;
const FlaskURL = `https://msdocs-python-webapp-quickstart-987.azurewebsites.net/`;

var config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const axiosInstance = axios.create({
  baseURL: `http://127.0.0.1:5000/`,
});

/*
 * Sends the email that the user provided to initate an email being
 * sent to that email so the user can confirm it
 *
 * @param email The vanderbilt email to be checked
 * @return 1 if the email is a good email, 0 if it is not. 
 */
export const SendEmail = async (email, carpool_id, name) => {
  try {
    const toSend = { 'email': email, 'carpool_id': carpool_id, 'name': name};

    console.log(toSend);
    axios
      .post(FlaskURL + "email", toSend, config)
      .then(function (response) {
        return response["data"]["confirm"];
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch {
    console.log("Send Email Error");
  }
};

/*
 * Sends the code and the email with associated with it to
 * check to make sure the code is correct. 
 *
 * @param email The email the code was sent to
 * @param code The code that the user entered
 * @return 1 If the code is correct, 0 otherwise
 */
export const SendCode = async (email, code, name, carpool_id) => {
  try {
    const toSend = { 'email': email, 'code': code, 'name': name, 'carpool_id': carpool_id};

    // True if confirmed
    // false if rejected
    let result = await axios
      .post(FlaskURL + "verifyCode", toSend, config)
      .then(function (response) {
        if (response['data']['confirm'] === 1){
          return true;
        } else {
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
      });

      return result;
  } catch {
    console.log("Send Code Error");
    return false;
  }
};
