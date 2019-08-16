import { GET_PAYMENT_LIST, ADD_PAYMENT, REMOVE_PAYMENT, EDIT_PAYMENT, ERR_PAYMENT, START_LOADING_PAY } from '../constants/Payment'

const initialeState = {
    Payments: [],
    isLoad: false,
    Error: '',
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case ERR_PAYMENT:
            return {...state,
                isLoad: false,
                Error: action.payload.err
            }
        case START_LOADING_PAY:
            return {...state,
                isLoad: true,
                Error: '',
                Payments: []
            }
        case GET_PAYMENT_LIST:
            return {...state,
                isLoad: false,
                Error: '',
                Payments: Array.isArray(action.payload.Payments) ? action.payload.Payments.sort((a, b) => a.TransDate < b.TransDate) : [],
            }
        case REMOVE_PAYMENT:
            return {...state,
                isLoad: false,
                Error: '',
                Payments: state.Payments.filter(item => item.Id != action.payload.Id)
            }
        case ADD_PAYMENT:
            return {...state,
                isLoad: false,
                Error: '',
                Payments: [
                    ...state.Payments,
                    {
                        Id: action.payload.Id,
                        Name: action.payload.Name,
                        CategoryId: action.payload.CategoryId,
                        TransDate: action.payload.TransDate,
                        Amount: action.payload.Amount,
                        IsSpending: action.payload.IsSpending,
                        IsPlaned: action.payload.IsPlaned
                    }
                ].sort((a,b) => a.TransDate < b.TransDate)
            }
        case EDIT_PAYMENT: 
            var pays = state.Payments.filter(item => item.Id != action.payload.Id)
            pays.push({
                Id: action.payload.Id,
                Name: action.payload.Name,
                CategoryId: action.payload.CategoryId,
                TransDate: action.payload.TransDate,
                Amount: action.payload.Amount,
                IsSpending: action.payload.IsSpending,
                IsPlaned: action.payload.IsPlaned
            })
            return {...state,
                isLoad: false,
                Error: '',
                Payments: pays.sort((a,b) => a.TransDate < b.TransDate)
            }
        default:
            return state
    }
}