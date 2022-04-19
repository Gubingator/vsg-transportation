/* Group Number: 5
 * Members: Sarah Zhang, Katie Cella, Bing Gu, Ethan Piper
 * sarah.s.zhang@vanderbilt.edu, katharine.a.cella@vanderbilt.edu, bing.q.gu@vanderbilt.edu, ethan.b.piper@vanderbilt.edu
 * Homework 03
 */

import React from "react";
import ReactDOM from "react-dom";
import * as redux from 'react-redux'

import { render, fireEvent } from "@testing-library/react";
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
  getByText("VANDY TRANSIT");
});

test("Schedule", () => {
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
  fireEvent.click(getByText("CARPOOL"));
  fireEvent.click(getByText("SCHEDULE A CARPOOL"));

  getByText("INSTRUCTIONS");
  getByText("First Name:");
});

test("Vanderbilt Info", () => {
  const store = mockStore();
  const { getByText, getAllByText } = render(
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>{" "}
    </Provider>
  );
  fireEvent.click(getByText("INFORMATION"));
  fireEvent.click(getByText("VANDERBILT"));
  getByText("VandyRide");

  fireEvent.click(getAllByText("+")[0]);
  getByText(/Gold Route/);
  fireEvent.click(getByText("-"));

  fireEvent.click(getAllByText("+")[1]);
  getByText(/Commute Hub/);
});

test("Nashville Info", () => {
  const store = mockStore();
  const { getByText, getAllByText } = render(
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>{" "}
    </Provider>
  );

  fireEvent.click(getByText("INFORMATION"));
  fireEvent.click(getByText("NASHVILLE"));
  getByText("WeGO Buses");

  fireEvent.click(getAllByText("+")[0]);

  getByText(/local and regional bus/);
  fireEvent.click(getByText("-"));

  fireEvent.click(getAllByText("+")[1]);
  getByText(/Ridehail services/);
  fireEvent.click(getByText("-"));

  fireEvent.click(getAllByText("+")[2]);
  getByText(/transit app/);
});

test("Lyft", () => {
  const store = mockStore();
  const { getByText, getByLabelText, getAllByText } = render(
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>{" "}
    </Provider>
  );

  fireEvent.click(getByText("LYFT"));
  getByText("Waiver");

  fireEvent.click(getAllByText("+")[0]);

  getByText(/Waiver Info/);
  fireEvent.click(getByText("-"));

  fireEvent.click(getAllByText("+")[1]);
  getByText(/discount codes for Lyft/);
});

test("Contact Us", () => {
  const store = mockStore();
  const { getByText, getAllByText } = render(
    <Provider store={store}>
      {" "}
      <BrowserRouter>
        {" "}
        <App />
      </BrowserRouter>{" "}
    </Provider>
  );

  fireEvent.click(getByText("ABOUT"));
  fireEvent.click(getByText("CONTACT US"));
  getByText(/Sarah Zhang/);
});

test("Navigation works", () => {
    const mockGetCarpools = jest.fn();
    carpoolServices.GetCarpools = jest.fn(() => {
      mockGetCarpools;
    });
  
    const spy = jest.spyOn(redux, "useSelector");
    spy.mockReturnValue([{
      id: 1,
      students: ["Student1", "Student2"],
      departure: "Hank Circle",
      destination: "Chick-fil-a",
      year: "2022",
      month: "04",
      day: "03",
      time: "4:00:00",
    }]);
  
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
  fireEvent.click(getByText("CARPOOL"));
  fireEvent.click(getByText("JOIN A CARPOOL"));

  getByText("Leaving from: Hank Circle");
});
