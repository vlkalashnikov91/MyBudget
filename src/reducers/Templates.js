import { GET_TEMPLATES_LIST, ADD_TEMPLATE, REMOVE_TEMPLATE, EDIT_TEMPLATE, START_LOADING_TEMPLATES, ERR_TEMPLATES } from '../constants/Templates'

const initialeState = {
    Templates: [],
    isLoad: false,
    Error: '',
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case ERR_TEMPLATES:
            return {...state,
                isLoad: false,
                Error: action.payload.err
            }
        case START_LOADING_TEMPLATES:
            return {...state,
                isLoad: true,
                Error: ''
            }
        case GET_TEMPLATES_LIST:
            return {...state,
                isLoad: false,
                Error: '',
                Templates: Array.isArray(action.payload.Templates) ? action.payload.Templates.sort((a,b) => a.Id < b.Id) : [],
            }
        case REMOVE_TEMPLATE:
            return {...state,
                isLoad: false,
                Error: '',
                Templates: state.Templates.filter(item => item.Id != action.payload.Id)
            }
        case ADD_TEMPLATE:
            return {...state,
                isLoad: false,
                Error: '',
                Templates: [
                    ...state.Templates,
                    {
                        Id: action.payload.Id,
                        CategoryId: action.payload.CategoryId,
                        Amount: action.payload.Amount,
                        IsSpending: action.payload.IsSpending,
                        Name: action.payload.Name,
                        Day: action.payload.Day,
                        UserId: action.payload.UserId
                    }
                ]
            }
        case EDIT_TEMPLATE: 
            var temps = state.Templates.filter(item => item.Id != action.payload.Id)
            temps.push({
                Id: action.payload.Id,
                CategoryId: action.payload.CategoryId,
                Amount: action.payload.Amount,
                IsSpending: action.payload.IsSpending,
                Name: action.payload.Name,
                Day: action.payload.Day,
                UserId: action.payload.UserId
            })
            return {...state,
                isLoad: false,
                Error: '',
                Templates: temps.sort((a,b) => a.Id < b.Id)
            }
        case EDIT_TEMPLATE: 
            return state
        default:
            return state
    }
}