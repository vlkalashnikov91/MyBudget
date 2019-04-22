import { GET_TARGET_LIST, REMOVE_TARGET, ADD_TARGET, EDIT_TARGET, ERR_TARGET, START_LOADING_TARGET } from '../constants/TargetDebts'

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
                Targets: action.payload.data
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
            var tr_debts = state.Targets.filter(item => item.Id != action.payload.Id)
            tr_debts.push({
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
            })
            return {...state,
                isLoad: false,
                Error: '',
                Targets: tr_debts
            }

        default:
            return state
    }
}