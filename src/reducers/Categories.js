import { ADD_CATEGORY, REMOVE_CATEGORY, GET_CATEGORY_LIST, EDIT_CATEGORY, ERR_CATEGORY, START_LOADING_CATS } from '../constants/Categories'
import moment from 'moment'

const initialeState = {
    Categories: [],
    Error: '',
    isLoad: false
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case ERR_CATEGORY:
            return {...state,
                isLoad: false,
                Error: action.payload.err
        }
        case START_LOADING_CATS:
            return {...state,
                isLoad: true,
                Error: '',
            }
        case GET_CATEGORY_LIST:
            return {...state,
                isLoad: false,
                Error: '',
                Categories: Array.isArray(action.payload.data) ? action.payload.data.sort((a,b) => a.Id > b.Id) : []
            } 
        case REMOVE_CATEGORY:
            return {...state,
                isLoad: false,
                Error: '',
                Categories: state.Categories.filter(item => item.Id != action.payload.Id)
            }
        case EDIT_CATEGORY:
            var cats = state.Categories.filter(item => item.Id != action.payload.Id)
            cats.push({
                Id: action.payload.Id,
                Name: action.payload.Name,
                IsSpendingCategory: action.payload.IsSpendingCategory,
                CreatedBy: action.payload.CreatedBy,
                Icon: action.payload.Icon,
                IsSystem: action.payload.IsSystem
            })
            return {...state,
                Error: '',
                isLoad: false,
                Categories: cats,
            }
        case ADD_CATEGORY:
            return {...state,
                Error: '',
                isLoad: false,
                Categories: [
                    ...state.Categories,
                    {
                        Id: action.payload.Id,
                        Name: action.payload.Name,
                        IsSpendingCategory: action.payload.IsSpendingCategory,
                        CreatedBy: action.payload.CreatedBy,
                        Icon: action.payload.Icon,
                        IsSystem: action.payload.IsSystem
                    }
                ]                
            }
        default:
            return state
    }
}