import { ADD_CATEGORY, REMOVE_CATEGORY, GET_CATEGORY_LIST, EDIT_CATEGORY, ERR_CATEGORY, START_LOADING_CATS } from '../constants/Categories'

const initialeState = {
    Income: [],
    Expense: [],
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

            let NoCatIncome = action.payload.income.filter(item => item.Id === 30 || item.Id === 31)
            let NoCatExpense = action.payload.expense.filter(item => item.Id === 30 || item.Id === 31)

            let CatIncomeArr = action.payload.income.filter(item => item.Id !== 30 && item.Id !== 31).sort((a,b) => a.Name > b.Name)
            CatIncomeArr = NoCatIncome.concat(CatIncomeArr)

            let CatExpenseArr = action.payload.expense.filter(item => item.Id !== 30 && item.Id !== 31).sort((a,b) => a.Name > b.Name)
            CatExpenseArr = NoCatExpense.concat(CatExpenseArr)

            return {...state,
                isLoad: false,
                Error: '',
                Income: CatIncomeArr,
                Expense: CatExpenseArr
            } 
        case REMOVE_CATEGORY:
            return {...state,
                isLoad: false,
                Error: '',
                Income: state.Income.filter(item => item.Id != action.payload.Id),
                Expense: state.Expense.filter(item => item.Id != action.payload.Id)
            }
            
        case EDIT_CATEGORY:
            let editCat = {
                Id: action.payload.Id,
                Name: action.payload.Name,
                IsSpendingCategory: action.payload.IsSpendingCategory,
                CreatedBy: action.payload.CreatedBy,
                Icon: action.payload.Icon,
                IsSystem: action.payload.IsSystem
            }

            let arr = []

            if (action.payload.IsSpendingCategory) {

                arr = state.Expense.filter(item => item.Id != action.payload.Id)
                arr.push(editCat)

                return {...state,
                    Error: '',
                    isLoad: false,
                    Expense: arr.sort((a,b) => a.Id > b.Id)
                }

            } else {
                arr = state.Income.filter(item => item.Id != action.payload.Id)
                arr.push(editCat)

                return {...state,
                    Error: '',
                    isLoad: false,
                    Income: arr.sort((a,b) => a.Id > b.Id)
                }
            }

        case ADD_CATEGORY:

            let newCat = {
                Id: action.payload.Id,
                Name: action.payload.Name,
                IsSpendingCategory: action.payload.IsSpendingCategory,
                CreatedBy: action.payload.CreatedBy,
                Icon: action.payload.Icon,
                IsSystem: action.payload.IsSystem
            }

            if (action.payload.IsSpendingCategory) {
                return {...state,
                    Error: '',
                    isLoad: false,
                    Expense: [
                        ...state.Expense,
                        newCat
                    ].sort((a,b) => a.Id > b.Id)
                }
            } else {
                return {...state,
                    Error: '',
                    isLoad: false,
                    Income: [
                        ...state.Income,
                        newCat
                    ].sort((a,b) => a.Id > b.Id)
                } 
            }

        default:
            return state
    }
}