import {newCarpool, setCarpools, deleteCarpool} from "../store/carpoolsSlice";
import * as axios from 'axios';

const axiosInstance = axios.create({    
	baseURL: `ourURL`,
});

const initData = [
	{'id': 1, 'location': 'Hank Circle',  'people': 2},
	{'id': 2, 'location': 'EBI Circle',  'people': 1},
	{'id': 2, 'location': 'Morgan Circle',  'people': 0},
]

export const GetCarpools = async (dispatch) => {
	try {
		// call our api

		dispatch(setCarpools(initData));
	} catch {
		console.log("Get Stems Error");
	}
}

export const NewCarpool = async (dispatch, carpool) => {
	try {
		// call adding API
		dispatch(newCarpool(carpool));
	} catch {
		console.log("New Carpool Error");
	}
}

export const DeleteCarpool = async (dispatch, carpool) => {
	try {
		// call delete API
		dispatch(deleteCarpool(carpool));
	} catch {
		console.log("Error when Deleting a carpool");
	}
}