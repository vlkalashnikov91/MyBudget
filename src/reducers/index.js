import { combineReducers } from 'redux'
import User from './User'
import Categories from './Categories'
import TargetDebts from './TargetDebts'
import Payments from './Payments'
import Graph from './Graph'

export default combineReducers({
    User,
    Categories,
    TargetDebts,
    Payments,
    Graph
})
