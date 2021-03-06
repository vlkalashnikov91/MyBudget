import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import moment from 'moment'
import { GET_PAYMENT_LIST, ADD_PAYMENT, REMOVE_PAYMENT, EDIT_PAYMENT, ERR_PAYMENT, START_LOADING_PAY } from '../constants/Payment'
import { URL, NO_CONN_MESS } from '../constants/Common'

export const PaymentActions = {
    Get: (UserId, year, month) => {
        return async (dispatch) => {
            dispatch({ type: START_LOADING_PAY })

            const isConnected = await NetInfo.isConnected.fetch()
            if (isConnected) {
                try {
                    const res = await axios.get(URL + `mobtransactions?id=${UserId}&year=${year}&month=${month}`)
                    dispatch(ActionFetchPayments(res.data))
                }
                catch(error) {
                    if (error.response) {
                        /*если 404 - значит данных нет за этот месяц */
                        if(error.response.status === 404) {
                            dispatch(ActionFetchPayments([]))
                            return 'done'
                        }
                    }
                    console.log('Error', error.message)
                    dispatch(ActionReject(error.message))
                }
            } else {
                dispatch(ActionReject(NO_CONN_MESS))
            }
            return 'done'
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
                    dispatch(ActionReject(NO_CONN_MESS))
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
                    dispatch(ActionReject(NO_CONN_MESS))
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
                    dispatch(ActionReject(NO_CONN_MESS))
                }
            })
        }
    },
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
const ActionFetchPayments = data => {
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
