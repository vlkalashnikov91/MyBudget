import { NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { USER_LOGIN, USER_LOGOUT, CHANGE_USER_SETTINGS, USER_ERR, USER_LOADING, USER_REGISTRATION, CHANGE_USER_PASS } from '../constants/User'
import { URL, NO_CONN_MESS, UN_AUTH_MESS } from '../constants/Common'
import { Storage } from '../utils/deviceServices'


export const UserAuth = {
    Login: (username, pass, saveMe) => {
        return (dispatch) => {
    
            dispatch({ type: USER_LOADING })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + '/login', {
                        "usr": username,
                        "pass": pass
                    })
                    .then(res => {
                        SaveMe(username, saveMe)
                        dispatch(ActionLogin(res.data, pass))
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
    Logout: () => {
        return(dispatch) => {
            dispatch(ActionLogout())
            Storage.Clear()
            /*
            axios.get(URL3).then(res => {
                dispatch(ActionLogout())
                AsyncStorage.clear()

            }).catch(error => {
                console.log("error", error)
                dispatch(ActionReject(error.message))
            })
            */
        }
    },
    Registration: (login, email, pass) => {
        return (dispatch) => {
    
            dispatch({ type: USER_LOADING })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
    
                    axios.post(URL + '/register', {
                        "Username" : login,
                        "Password" : pass,
                        "Email" : email
                    })
                    .then(res => {
                        dispatch(ActionReg(res.data, pass))
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
    ChangeSettings: (UserId, DefCurrency, CarryOverRests, UseTemplates) => {
        return (dispatch) => {

            dispatch({ type: USER_LOADING })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.put(URL + `/updateSettings/${UserId}`, {
                        "DefCurrency": DefCurrency,
                        "CarryoverRests": CarryOverRests,
                        "UseTemplates": UseTemplates
                    })
                    .then(res => {
                        dispatch(ActionSettings(DefCurrency, CarryOverRests, UseTemplates))
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
    ChangePass: (UserId, oldPass, newPass) => {
        return (dispatch) => {

            dispatch({ type: USER_LOADING })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + `/manage/changepassword`, {
                        "UserId": UserId,
                        "OldPassword": oldPass,
                        "NewPassword": newPass
                    })
                    .then(res => {
                        dispatch(ActionNewPass(UserId, oldPass, newPass))
                    }).catch(error => {
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



const SaveMe = async (username, isSave) => {
    /* Если надо сохранить, то перетираем страго пользователя
        Если созранить не надо, то нужно проверить какой логин был введен.
            Если был введен старый логин и выбрано "не запоминать" - удалить логин
            Если был введен новый логин и выбрано "не сохранять" - оставляем старый логин
    */
    let oldUser = await Storage.GetItem('username')

    if (isSave) {
        Storage.SaveItem('username', username)
    } else {
        if (oldUser.toUpperCase() === username.toUpperCase()) {
            Storage.RemoveItem('username')
        }
    }
}


/*+++++++++++++++ Действия при ошибки в запросе ++++++++++++++++ */
const ActionReject = err => {
    return {
        type: USER_ERR,
        payload: {
            err
        }
    } 
}

/*+++++++++++++++ Действия при login ++++++++++++++++ */
const ActionLogin = (userInfo, pass) => {
    if (userInfo.Status === 401) {
        return {
            type: USER_ERR,
            payload: {
                err: UN_AUTH_MESS
            }
        } 
    }

    return {
        type: USER_LOGIN,
        payload: {
            Status: userInfo.Status,
            UserId: userInfo.UserId,
            DefCurrency: userInfo.DefCurrency,
            CarryOverRests: userInfo.CarryOverRests,
            UseTemplates: userInfo.UseTemplates,
            UpdateDate: userInfo.UpdateDate
        }
    }
}

/*+++++++++++++++ Действия при logout ++++++++++++++++ */
const ActionLogout = () => {
    return {
        type: USER_LOGOUT,
        payload: {}
    }
}

/*+++++++++++++++ Действия при регистрации ++++++++++++++++ */
const ActionReg = (UserId, pass) => {
    return {
        type: USER_REGISTRATION,
        payload: {
            UserId: UserId
        }
    }
}

/*+++++++++++++++ Действия при смене клиентских данных ++++++++++++++++ */
const ActionSettings = (DefCurrency, CarryOverRests, UseTemplates) => {
    return {
        type: CHANGE_USER_SETTINGS,
        payload: {
            DefCurrency: DefCurrency,
            CarryOverRests: CarryOverRests,
            UseTemplates: UseTemplates,
        }
    }
}

/*+++++++++++++++ Действия при смене клиентских данных ++++++++++++++++ */
const ActionNewPass = (UserId, oldPass, newPass) => {
    return {
        type: CHANGE_USER_PASS,
        payload: {}
    }
}