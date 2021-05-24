import {createStore, combineReducers, applyMiddleware} from 'redux';
import {taskMiddleware} from 'react-palm/tasks';
import { customizedKeplerGlReducer } from './reducers/customizedKeplerGlReducer';

const reducer = combineReducers({
  keplerGl: customizedKeplerGlReducer,
});

// create store
const store = createStore(reducer, {}, applyMiddleware(taskMiddleware));

export default store