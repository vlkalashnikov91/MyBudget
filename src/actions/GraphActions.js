import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { START_LOADING_GRAPH, GET_GRAPH_DATA, ERR_REQUEST_GRAPH } from '../constants/Graph'

const URL = 'http://mybudget.somee.com/api'
const NoConn = "Отсутствует подключение к интернету"


const ActionReject = err => {
    return {
        type: ERR_REQUEST_GRAPH,
        payload: {
            err
        }
    }
}

const ActionFetchData = data => {
    return {
        type: GET_GRAPH_DATA,
        payload: {
            data
        }
    }
}

export const GraphActions = {
    Get: (UserId, type) => {
        return (dispatch) => {

            dispatch({ type:START_LOADING_GRAPH })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.get(URL + `/piegraph?id=${UserId}&term=${type}`).then(res => {
                        dispatch(ActionFetchData(res.data))
                    }).catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NoConn))
                }
            })
        }
    }
}
