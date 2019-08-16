import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { GET_TARGET_LIST, REMOVE_TARGET, ADD_TARGET, EDIT_TARGET, ERR_TARGET, START_LOADING_TARGET, INCREASE_TARGET } from '../constants/TargetDebts'
import { URL, NO_CONN_MESS } from '../constants/Common'

export const TargetActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_TARGET })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.get(URL + `goals?id=${UserId}`)
                    .then(res => {
                        dispatch(ActionFetchList(res.data))
                    })
                    .catch(error => {
                        if (error.response) {
                            /*если 404 - значит данных */
                            if(error.response.status === 404) {
                                dispatch(ActionFetchList([]))
                            } else {
                                dispatch(ActionReject(error.message))
                            }
                        } else {
                            console.log('Error', error.message)
                            dispatch(ActionReject(error.message))
                        }
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    },
    Add: (UserId, GoalName, Type, Amount, CurAmount, CompleteDate) => {
        return (dispatch) => {
    
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.post(URL, {
                        "GoalName": GoalName,
                        "Type": Type,
                        "Amount": Amount,
                        "CurAmount": CurAmount,
                        "UserId": UserId,
                        "CompleteDate": CompleteDate
                    })
                    .then(res => {
                        dispatch(ActionAdd(res.data, GoalName, Type, Amount, CurAmount, CompleteDate, UserId))
                    }).catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    },
    Delete: (Id) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.delete(URL + `/${Id}`)
                    .then(res => {
                        dispatch(ActionDelete(Id))
                    })
                    .catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    },
    Edit: (UserId, Id, GoalName, Type, Amount, CurAmount, CompleteDate) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.put(URL + `/${Id}`,{
                        "GoalName": GoalName,
                        "Amount": Amount,
                        "CurAmount": CurAmount,
                        "CompleteDate": CompleteDate,
                        "IsActive": true
                    })
                    .then(res => {
                        dispatch(ActionEdit(Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId))
                    }).catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    },
    Increase: (Id, Amount) => {
        return(dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.get(URL + `/${Id}/payGoal?amount=${Amount}`)
                    .then(res => {
                        dispatch(ActionIncrease(Id, Amount))
                    })
                    .catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    }
}


/*+++++++++++++++ Действие при ошибки в запросе ++++++++++++++++ */
const ActionReject = err => {
    return {
        type: ERR_TARGET,
        payload: {
            err
        }
    }
}

/*+++++++++++++++ Загрузка списка карточек ++++++++++++++++ */
const ActionFetchList = data => {
    return {
        type: GET_TARGET_LIST,
        payload: {
            data
        }
    }
}

/*+++++++++++++++ Действия при удалении ++++++++++++++++ */
const ActionDelete = Id => {
    return {
        type: REMOVE_TARGET,
        payload: {
            Id
        }
    }
}

/*+++++++++++++++ Действия при создании ++++++++++++++++ */
const ActionAdd = (Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId) => {
    return {
        type: ADD_TARGET,
        payload: {
            Id,
            GoalName,
            Type,
            Amount,
            CurAmount,
            CompleteDate,
            UserId
        }
    }
}

/*+++++++++++++++ Действия при изменении ++++++++++++++++ */
const ActionEdit = (Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId) => {
    return {
        type: EDIT_TARGET,
        payload: {
            Id, 
            GoalName, 
            Type, 
            Amount, 
            CurAmount, 
            CompleteDate,
            UserId
        }
    }
}

/*+++++++++++++++ Действия при пополнении ++++++++++++++++ */
const ActionIncrease = (Id, Amount) => {
    return {
        type: INCREASE_TARGET,
        payload: {
            Id,
            Amount
        }
    }
}

