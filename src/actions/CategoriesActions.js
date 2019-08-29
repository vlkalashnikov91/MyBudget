import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { GET_CATEGORY_LIST, REMOVE_CATEGORY, ADD_CATEGORY, EDIT_CATEGORY, ERR_CATEGORY, START_LOADING_CATS } from '../constants/Categories'
import { URL, NO_CONN_MESS } from '../constants/Common'
import { Storage } from '../utils/deviceServices'


export const CategoriesActions = {
    Get: (UserId) => {
        return (dispatch) => {
    
            dispatch({ type: START_LOADING_CATS })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.get(URL + `categories?userid=${UserId}`)
                    .then(res => {
                        StoreActions.Save(res.data)
                        dispatch(ActionFetchCategories(res.data))
                    })
                    .catch(error => {
                        if (error.response) {
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
    Add: (UserId, Name, IsSpendingCategory) => {
        return (dispatch) => {

            dispatch({ type: START_LOADING_CATS })

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
                        StoreActions.Add(res.data, Name, IsSpendingCategory, null)
                        dispatch(ActionAddCat(res.data, Name, IsSpendingCategory, null))
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
    Edit: (Id, Name, IsSpendingCategory, Icon) => {
        return (dispatch) => {

            dispatch({ type: START_LOADING_CATS })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                
                    axios.put(URL + `categories/${Id}`, {
                        "Name" : Name,
                        "Icon" : Icon
                    })
                    .then(res => {
                        StoreActions.Edit(Id, Name, IsSpendingCategory, Icon)
                        dispatch(ActionEditCat(Id, Name, IsSpendingCategory, Icon))
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
    Delete: (UserId, Id) => {
        return (dispatch) => {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    axios.delete(URL + `categories/${Id}?userid=${UserId}`)
                    .then(res => {
                        StoreActions.Delete(Id)
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
    },
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
const ActionFetchCategories = data => {

    let income = []
    let expense = []

    if (Array.isArray(data)) {
        data.map(item => {
            if (item.IsSpendingCategory) {
                expense.push(item)
            } else {
                income.push(item)
            }
        })
    }

    return {
        type: GET_CATEGORY_LIST,
        payload: {
            income,
            expense
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
const ActionAddCat = (Id, Name, IsSpendingCategory, Icon) => {
    return {
        type: ADD_CATEGORY,
        payload: {
            Id,
            Name, 
            IsSpendingCategory,
            Icon
        }
    }
}

/*+++++++++++++++ Редактирование категории ++++++++++++++++ */
const ActionEditCat = (Id, Name, IsSpendingCategory, Icon) => { 
    return {
        type: EDIT_CATEGORY,
        payload: {
            Id, 
            Name, 
            IsSpendingCategory, 
            Icon
        }
    }   
}




/* Действия для работы со Storage */
const StoreActions = {
    Get: async () => {
        let categories = await Storage.GetItem('categories')
        if (categories.length > 0) {
            return JSON.parse(categories)
        }
        return []
    },
    Save: async (categories) => {
        Storage.SaveItem('categories', JSON.stringify(categories))
    },
    Add: async (Id, Name, IsSpendingCategory, Icon) => {
        let categories = await Storage.GetItem('categories')
        if (categories.length > 0) {
            let categoriesArr = JSON.parse(categories)

            categoriesArr.push({
                Id: Id,
                Name: Name,
                IsSpendingCategory: IsSpendingCategory,
                Icon: Icon,
                IsSystem: false
            })

            Storage.SaveItem('categories', JSON.stringify(categoriesArr))
        }
    },
    Edit: async (Id, Name, IsSpendingCategory, Icon) => {
        let categories = await Storage.GetItem('categories')
        if (categories.length > 0) {
            let categoriesArr = JSON.parse(categories)
            let newArr = categoriesArr.filter(item => item.Id != Id)

            newArr.push({
                Id: Id,
                Name: Name,
                IsSpendingCategory: IsSpendingCategory,
                Icon: Icon,
                IsSystem: false
            })

            Storage.SaveItem('categories', JSON.stringify(newArr))
        }
    },
    Delete: async (Id) => {
        let categories = await Storage.GetItem('categories')
        if (categories.length > 0) {
            let categoriesArr = JSON.parse(categories)
            let newArr = categoriesArr.filter(item => item.Id != Id)

            Storage.SaveItem('categories', JSON.stringify(newArr))
        }
    }
}