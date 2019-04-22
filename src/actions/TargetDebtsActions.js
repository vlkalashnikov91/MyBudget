import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { GET_TARGET_LIST, REMOVE_TARGET, ADD_TARGET, EDIT_TARGET, ERR_TARGET, START_LOADING_TARGET } from '../constants/TargetDebts'

const URL = 'http://mybudget.somee.com/api/goals'
const NoConn = "Отсутствует подключение к интернету"

export const TargetDebtsActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_TARGET })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.get(URL + `?id=${UserId}`)
                    .then(res => {
                        dispatch(ActionFetchList(res.data))
                    })
                    .catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                } else {
                    dispatch(ActionReject(NoConn))
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
                    dispatch(ActionReject(NoConn))
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
                    dispatch(ActionReject(NoConn))
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
                        dispatch(AcctionEdit(Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId))
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
const AcctionEdit = (Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId) => {
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

