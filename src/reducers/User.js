import { USER_LOGIN, USER_LOGOUT, CHANGE_USER_SETTINGS, USER_ERR, USER_LOADING, USER_REGISTRATION, CHANGE_USER_PASS } from '../constants/User'

const initialeState = {
    isLoad: false,
    Error: '',
    UserId: '',
    DefCurrency: '',
    CarryOverRests: false,
    UseTemplates: false,
    UpdateDate: ''
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {...state,
                isLoad: true,
                Error: ''
            }
        case USER_ERR:
            return {...state,
                isLoad: false,
                Error: action.payload.err,
            }
        case USER_LOGIN:
            return {...state, 
                isLoad: false,
                Error: '',
                UserId: action.payload.UserId,
                DefCurrency: action.payload.DefCurrency,
                CarryOverRests: action.payload.CarryOverRests,
                UseTemplates: action.payload.UseTemplates,
                UpdateDate: action.payload.UpdateDate
            }
        case USER_LOGOUT:
            return {...state,
                isLoad: false,
                Error: '',
                UserId: '',
                DefCurrency: '',
                CarryOverRests: false,
                UseTemplates: false,
                UpdateDate: ''
            }
        case USER_REGISTRATION:
            return {...state, 
                isLoad: false,
                Error: '',
                UserId: action.payload.UserId,
            }
        case CHANGE_USER_SETTINGS:
            return {...state,
                isLoad: false,
                Error: '',
                DefCurrency: action.payload.DefCurrency,
                CarryOverRests: action.payload.CarryOverRests,
                UseTemplates: action.payload.UseTemplates,
                UpdateDate: action.payload.UpdateDate
            }
        case CHANGE_USER_PASS: 
            return {...state,
                isLoad: false,
                Error: ''
            }
        default:
            return state
    }
}