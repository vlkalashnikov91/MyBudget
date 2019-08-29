import { GET_TARGET_LIST, REMOVE_TARGET, ADD_TARGET, EDIT_TARGET, ERR_TARGET, INCREASE_TARGET, START_LOADING_TARGET } from '../constants/TargetDebts'

const initialeState = {
    Targets: [],
    isLoad: false,
    Error: '',
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case ERR_TARGET: 
            return {...state,
                isLoad: false,
                Error: action.payload.err
            }
        case START_LOADING_TARGET:
            return {...state,
                isLoad: true,
                Error: ''
            }
        case GET_TARGET_LIST:
            return {...state,
                isLoad: false,
                Error:'',
                Targets: Array.isArray(action.payload.data) ? action.payload.data : [],
            } 
        case REMOVE_TARGET:
            return {...state,
                isLoad: false,
                Error: '',
                Targets: state.Targets.filter(item => item.Id != action.payload.Id)
            }
        case ADD_TARGET:
            return {...state,
                isLoad: false,
                Error: '',
                Targets: [
                    ...state.Targets,
                    {
                        Id: action.payload.Id,
                        GoalName: action.payload.GoalName,
                        Type: action.payload.Type,
                        Amount: action.payload.Amount,
                        CurAmount: action.payload.CurAmount,
                        CompleteDate: action.payload.CompleteDate,
                        UserId: action.payload.UserId,
                        IsActive: true,
                        User: null,
                        Description: null
                    }
                ]                
            }
        case EDIT_TARGET:
            var targets = state.Targets.map(item => {
                if (item.Id === action.payload.Id) {
                    item.GoalName = action.payload.GoalName,
                    item.Amount = action.payload.Amount,
                    item.CurAmount = action.payload.CurAmount,
                    item.CompleteDate = action.payload.CompleteDate
                }
                return item
            })
                
            return {...state,
                isLoad: false,
                Error: '',
                Targets: targets
            }
        case INCREASE_TARGET:
            var targets = state.Targets.map(item => {
                if (item.Id === action.payload.Id) {
                    item.CurAmount = item.CurAmount + action.payload.Amount
                }
                return item
            })

            return {...state,
                isLoad: false,
                Error: '',
                Targets: targets
            }

        default:
            return state
    }
}