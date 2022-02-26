import { combineReducers } from 'redux';
import diy from './diy';
import fundDetails from './fundDetails';

export default combineReducers({
	fundDetails,
    diy,
});
