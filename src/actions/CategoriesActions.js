import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { GET_CATEGORY_LIST, REMOVE_CATEGORY, ADD_CATEGORY, EDIT_CATEGORY, ERR_CATEGORY, START_LOADING_CATS } from '../constants/Categories'

const URL = `http://mybudget.somee.com/api/`
const NoConn = "Отсутствует подключение к интернету"


export const CategoriesActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_CATS })
    
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.get(URL + `categories?userid=${UserId}`)
                    .then(res => {
                        dispatch(ActionFetchList(res.data))
                    })
                    .catch(error => {
                        if (error.response) {
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
    Add: (UserId, Name, IsSpendingCategory) => {
        return (dispatch) => {

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + `categories`, {
                            "Name": Name,
                            "IsSpendingCategory": IsSpendingCategory,
                            "CreatedBy": UserId,
                            "Icon": null
                        }
                    )
                    .then(res => {
                        dispatch(ActionAddCat(res.data, Name, IsSpendingCategory, null, UserId))
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
    Edit: (Id, Name, IsSpendingCategory, CreatedBy, Icon) => {

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {

                return (dispatch) => {
                    axios.put(URL + `categories/${Id}`, {
                        "Name" : Name,
                        "Icon" : Icon
                    })
                    .then(res => {
                        dispatch(ActionEditCat(Id, Name, IsSpendingCategory, CreatedBy, Icon))
                    })
                    .catch(error => {
                        console.log("error", error)
                        dispatch(ActionReject(error.message))
                    })
                }
            } else {
                dispatch(ActionReject(NoConn))
            }
        })
    },
    Delete: (UserId, Id) => {
        return (dispatch) => {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.delete(URL + `categories/${Id}?userid=${UserId}`)
                    .then(res => {
                        dispatch(ActionDeleteCategory(Id))
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
        type: ERR_CATEGORY,
        payload: {
            err
        }
    }
}

/*+++++++++++++++ Загрузка списка категорий ++++++++++++++++ */
const ActionFetchList = data => {
    return {
        type: GET_CATEGORY_LIST,
        payload: {
            data
        }
    }
}

/*+++++++++++++++ Удаление категории ++++++++++++++++ */
const ActionDeleteCategory = (Id) => {
    return {
        type: REMOVE_CATEGORY,
        payload: {
            Id
        }
    }
}

/*+++++++++++++++ Создание категории ++++++++++++++++ */
const ActionAddCat = (Id, Name, IsSpendingCategory, Icon, CreatedBy) => {
    return {
        type: ADD_CATEGORY,
        payload: {
            Id,
            Name, 
            IsSpendingCategory,
            CreatedBy,
            Icon
        }
    }
}

/*+++++++++++++++ Редактирование категории ++++++++++++++++ */
const ActionEditCat = (Id, Name, IsSpendingCategory, CreatedBy, Icon) => { 
    return {
        type: EDIT_CATEGORY,
        payload: {
            Id, 
            Name, 
            IsSpendingCategory, 
            CreatedBy, 
            Icon
        }
    }   
}
