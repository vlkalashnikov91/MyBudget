import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { GET_TEMPLATES_LIST, ADD_TEMPLATE, REMOVE_TEMPLATE, EDIT_TEMPLATE, ERR_TEMPLATES, START_LOADING_TEMPLATES } from '../constants/Templates'
import { URL, NO_CONN_MESS } from '../constants/Common'

export const TemplatesActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_TEMPLATES })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
    
                    axios.get(URL + `Template?id=${UserId}`)
                    .then(res => {
                        dispatch(ActionFetchTemplates(res.data))
                    })
                    .catch(function (error) {
                        if (error.response) {
                            /*если 404 - значит данных нет за этот месяц */
                            if(error.response.status === 404) {
                                dispatch(ActionFetchTemplates([]))
                                return
                            }
                        }
                        console.log('Error', error.message)
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

            dispatch({ type: START_LOADING_TEMPLATES })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.delete(URL + `Template?id=${Id}`)
                    .then(res => {
                        dispatch(ActionDeleteTemplate(Id))
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
    Add: (Name, Amount, Day, CategoryId, IsSpending, UserId) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + 'template',{
                        "Name" : Name,
                        "Amount" : Amount,
                        "Day" : Day,
                        "CategoryId" : CategoryId,
                        "IsSpending" : IsSpending,
                        "UserId": UserId
                    })
                    .then(res => {
                        dispatch(ActionAddTemplate(res.data, Name, Amount, Day, CategoryId, IsSpending, UserId))
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
    Edit: (Id, Name, Amount, Day, CategoryId, IsSpending, UserId) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.put(URL + `template/${Id}`, {
                        "Name" : Name,
                        "Amount" : Amount,
                        "Day" : Day,
                        "CategoryId" : CategoryId,
                        "IsSpending" : IsSpending,
                        "UserId" : UserId,
                    })
                    .then(res => {
                        dispatch(ActionEditTemplate(Id, Name, Amount, Day, CategoryId, IsSpending, UserId))
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
        type: ERR_TEMPLATES,
        payload: {
            err
        }
    }
}

/*+++++++++++++++ Загрузка списка шаблонов ++++++++++++++++ */
const ActionFetchTemplates = data => {
    return {
        type: GET_TEMPLATES_LIST,
        payload: {
            Templates: data
        }
    }
}

/*+++++++++++++++ Удаление шаблона ++++++++++++++++ */
const ActionDeleteTemplate = Id => {
    return {
        type: REMOVE_TEMPLATE,
        payload: {
            Id
        }
    }
}

/*+++++++++++++++ Создание шаблона ++++++++++++++++ */
const ActionAddTemplate = (Id, Name, Amount, Day, CategoryId, IsSpending, UserId) => {
    return {
        type: ADD_TEMPLATE,
        payload: {
            Id, 
            Name, 
            Amount, 
            Day, 
            CategoryId, 
            IsSpending, 
            UserId
        }
    }
}

/*+++++++++++++++ Редактирование шаблона ++++++++++++++++ */
const ActionEditTemplate = (Id, Name, Amount, Day, CategoryId, IsSpending, UserId) => { 
    return {
        type: EDIT_TEMPLATE,
        payload: {
            Id,
            CategoryId,
            Amount,
            Name,
            Day,
            IsSpending,
            UserId
        }
    }   
}
