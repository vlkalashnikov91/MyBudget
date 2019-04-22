import { AsyncStorage, NetInfo } from 'react-native'
import axios from 'react-native-axios'
import { USER_LOGIN, USER_LOGOUT, CHANGE_USER_SETTINGS, USER_ERR, USER_LOADING, USER_REGISTRATION } from '../constants/User'

const URL = `http://mybudget.somee.com/api/`
const NoConn = "Отсутствует подключение к интернету"

export const UserAuth = {
    Login: (username, pass) => {
        return (dispatch) => {
    
            dispatch({ type: USER_LOADING })

            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {

                    axios.post(URL + '/login', {
                        "usr": username,
                        "pass": pass
                    })
                    .then(res => {
                        dispatch(ActionLogin(res.data, pass))
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
    Logout: () => {
        return(dispatch) => {
            dispatch(ActionLogout())
            AsyncStorage.clear()
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
                    dispatch(ActionReject(NoConn))
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
                    dispatch(ActionReject(NoConn))
                }
            })
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
    AsyncStorage.setItem('UserId', userInfo.UserId)
    AsyncStorage.setItem('Pass', pass)
    AsyncStorage.setItem('DefCurrency', userInfo.DefCurrency)

/*    AsyncStorage.setItem('UseTemplates', userInfo.UseTemplates)
    AsyncStorage.setItem('CarryOverRests', userInfo.CarryOverRests)
    AsyncStorage.setItem('UpdateDate', userInfo.UpdateDate)
*/

    return {
        type: USER_LOGIN,
        payload: {
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
    AsyncStorage.setItem('UserId', UserId)
    AsyncStorage.setItem('Pass', pass)

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