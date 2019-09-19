import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import moment from 'moment'
import { GET_TARGET_LIST, REMOVE_TARGET, ADD_TARGET, EDIT_TARGET, ERR_TARGET, START_LOADING_TARGET, INCREASE_TARGET } from '../constants/TargetDebts'
import { URL, NO_CONN_MESS } from '../constants/Common'
import { Storage } from '../utils/deviceServices'

export const TargetActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_TARGET })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.get(URL + `goals?id=${UserId}`)
                    .then(res => {
                        StoreActions.Save(res.data)
                        dispatch(ActionFetchList(res.data))
                    })
                    .catch(error => {
                        if (error.response) {
                            /*если 404 - значит данных */
                            if(error.response.status === 404) {
                                StoreActions.Save([])
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
                    axios.post(URL + 'goals', {
                        "GoalName": GoalName,
                        "Type": Type,
                        "Amount": Amount,
                        "CurAmount": CurAmount,
                        "UserId": UserId,
                        "CompleteDate": CompleteDate
                    })
                    .then(res => {
                        StoreActions.Add(res.data, GoalName, Type, Amount, CurAmount, CompleteDate, UserId)
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
                    axios.delete(URL + `goals/${Id}`)
                    .then(res => {
                        StoreActions.Delete(Id)
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

                    axios.put(URL + `goals/${Id}`,{
                        "GoalName": GoalName,
                        "Amount": Amount,
                        "CurAmount": CurAmount,
                        "CompleteDate": ((CompleteDate===undefined)||(CompleteDate==null))?null:moment(CompleteDate).format('YYYY.MM.DD'),
                        "IsActive": true
                    })
                    .then(res => {
                        StoreActions.Edit(Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId)
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
                    axios.get(URL + `goals/${Id}/payGoal?amount=${Amount}`)
                    .then(res => {
                        StoreActions.Increase(Id, Amount)
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

export const GetFinished = async () => {
    return await StoreActions.GetFinished()
}

export const AddToFinished = (Id) => {
    return StoreActions.AddToFinished(Id)
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


/* Действия для работы со Storage */
const StoreActions = {
    Get: async () => {
        let targets = await Storage.GetItem('targets')
        if (targets.length > 0) {
            return JSON.parse(targets)
        }
        return []
    },
    Save: async (targets) => {
        Storage.SaveItem('targets', JSON.stringify(targets))
    },
    Add: async (Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId) => {
        let targets = await Storage.GetItem('targets')
        if (targets.length > 0) {
            let targetsArr = JSON.parse(targets)

            targetsArr.push({
                Id: Id,
                GoalName: GoalName,
                Type: Type,
                Amount: Amount,
                CurAmount: CurAmount,
                CompleteDate: CompleteDate,
                UserId: UserId,
                IsActive: true,
                User: null,
                Description: null
            })

            Storage.SaveItem('targets', JSON.stringify(targetsArr))
        }
    },
    Edit: async (Id, GoalName, Type, Amount, CurAmount, CompleteDate, UserId) => {
        let targets = await Storage.GetItem('targets')
        if (targets.length > 0) {
            let targetsArr = JSON.parse(targets)
            let newArr = targetsArr.filter(item => item.Id != Id)

            newArr.push({
                Id: Id,
                GoalName: GoalName,
                Type: Type,
                Amount: Amount,
                CurAmount: CurAmount,
                CompleteDate: CompleteDate,
                UserId: UserId
            })

            Storage.SaveItem('targets', JSON.stringify(newArr))
        }
    },
    Delete: async (Id) => {
        let targets = await Storage.GetItem('targets')
        if (targets.length > 0) {
            let targetsArr = JSON.parse(targets)
            let newArr = targetsArr.filter(item => item.Id != Id)

            Storage.SaveItem('targets', JSON.stringify(newArr))
        }
    },
    Increase: async(Id, Amount) => {
        let targets = await Storage.GetItem('targets')
        if (targets.length > 0) {
            let targetsArr = JSON.parse(targets)
            let newArr = targetsArr.map(item => {
                if (item.Id === Id) {
                    item.CurAmount = item.CurAmount + Amount
                }
                return item
            })
            Storage.SaveItem('targets', JSON.stringify(newArr))
        }
    },
    GetFinished: async() => {
        let targets = await Storage.GetItem('finishtargets')
        if (targets.length > 0) {
            return JSON.parse(targets)
        }
        return []  
    },
    AddToFinished: async(Id) => {
        let targets = await Storage.GetItem('finishtargets')
        let targetsArr = []
        if (targets.length > 0) {
            targetsArr = JSON.parse(targets)
            targetsArr.push(Id)
            Storage.SaveItem('finishtargets', JSON.stringify(targetsArr))
        } else {
            targetsArr.push(Id)
        }
        Storage.SaveItem('finishtargets', JSON.stringify(targetsArr))
    }
}