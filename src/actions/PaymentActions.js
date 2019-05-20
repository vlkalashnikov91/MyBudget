import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import moment from 'moment'
import {  GET_PAYMENT_LIST, ADD_PAYMENT, REMOVE_PAYMENT, EDIT_PAYMENT, ERR_PAYMENT, START_LOADING_PAY } from '../constants/Payment'

const URL = `http://mybudget.somee.com/api/`
const NoConn = "Отсутствует подключение к интернету"

export const PaymentActions = {
    Get: (UserId, year, month) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_PAY })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
    
                    axios.get(URL + `mobtransactions?id=${UserId}&year=${year}&month=${month}`)
                    .then(res => {
                        dispatch(ActionFetchList(res.data))
                    })
                    .catch(function (error) {
                        if (error.response) {
                            /*если 404 - значит данных нет за этот месяц */
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
                    dispatch(ActionReject(NoConn))
                }
            })
        }
    },
    Delete: (id) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.delete(URL + `mobtransactions?id=${id}`)
                    .then(res => {
                        dispatch(ActionDeletePay(id))
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
    Add: (CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned, UserId) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + 'mobtransactions',{
                        "Name" : Name,
                        "Amount" : Amount,
                        "TransDate" : moment(TransDate).format('YYYY.MM.DD'),
                        "CategoryId" : CategoryId,
                        "IsSpending" : IsSpending,
                        "Description" : null,
                        "IsPlaned" : IsPlaned,
                        "UserId": UserId
                    })
                    .then(res => {
                        dispatch(ActionAddPay(res.data, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned, UserId))
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
    Edit: (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.put(URL + `mobtransactions/${Id}`, {
                        "Name" : Name,
                        "Amount" : Amount,
                        "TransDate" : moment(TransDate).format('YYYY.MM.DD'),
                        "CategoryId" : CategoryId,
                        "IsPlaned" : IsPlaned,
                    })
                    .then(res => {
                        dispatch(ActionEditPay(Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned))
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
    }
}


/*+++++++++++++++ Действие при ошибки в запросе ++++++++++++++++ */
const ActionReject = err => {
    return {
        type: ERR_PAYMENT,
        payload: {
            err
        }
    }
}

/*+++++++++++++++ Загрузка списка платежей ++++++++++++++++ */
const ActionFetchList = data => {
    return {
        type: GET_PAYMENT_LIST,
        payload: {
            Payments: data
        }
    }
}

/*+++++++++++++++ Удаление платежа ++++++++++++++++ */
const ActionDeletePay = Id => {
    return {
        type: REMOVE_PAYMENT,
        payload: {
            Id
        }
    }
}

/*+++++++++++++++ Создание платежа ++++++++++++++++ */
const ActionAddPay = (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned, UserId) => {
    return {
        type: ADD_PAYMENT,
        payload: {
            Id, 
            CategoryId, 
            Amount, 
            Name, 
            TransDate, 
            IsSpending, 
            IsPlaned, 
            UserId
        }
    }
}

/*+++++++++++++++ Редактирование платежа ++++++++++++++++ */
const ActionEditPay = (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => { 
    return {
        type: EDIT_PAYMENT,
        payload: {
            Id,
            CategoryId,
            Amount,
            Name,
            TransDate,
            IsSpending,
            IsPlaned
        }
    }   
}
