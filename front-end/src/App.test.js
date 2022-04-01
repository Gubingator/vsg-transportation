import React from "react";
import ReactDOM from "react-dom";

import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import App from "./App";
import HomePage from "./pages/HomePage";
import { BrowserRouter } from "react-router-dom";

import * as carpoolServices from "./services/carpools";

/*
 * These are needed because we are using redux. They can also be changed
 * depending on what we want to do. 
 */
const mockStore = configureStore();
const mockDispatchfn = jest.fn();

/*
 * Note: the jest.fn can also return specific info if we want to get fancy
 */

test("renders the App content", () => {
  /*
   * Note: the jest.fn can also return specific info if we want to get fancy
   */
  const mockGetCarpools = jest.fn();
  carpoolServices.GetCarpools = jest.fn(() => {
    mockGetCarpools;
  });

  const store = mockStore();
  const { getByText, getByLabelText } = render(
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>{" "}
    </Provider>
  );

  getByText("STUDENT TRANSPORTATION");
});
