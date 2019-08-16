import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { START_LOADING_GRAPH, GET_GRAPH_DATA, ERR_REQUEST_GRAPH } from '../constants/Graph'
import { URL, NO_CONN_MESS} from '../constants/Common'

export const GraphActions = {
    Get: (UserId, from, to) => {
        return (dispatch) => {

            dispatch({ type:START_LOADING_GRAPH })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {


                    axios.get(URL + `graph/getSpendingGraph/${UserId}/${from}/${to}`).then(res => {
                        dispatch(ActionFetchData(res.data))
                    }).catch(error => {
                        if (error.response) {
                            /*если 404 - значит данных нет*/
                            if(error.response.status === 404) {
                                dispatch(ActionFetchData([]))
                            } else {
                                console.log("error", error)
                                dispatch(ActionReject(error.message))
                            }
                        } else {
                            console.log("error", error)
                            dispatch(ActionReject(error.message))
                        }
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    }
}


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
