/* Константы для навигации */
export const INCOME = 'INCOME'
export const EXPENSE = 'EXPENSE'
/* Константы для редьюсеров */
export const GET_PAYMENT_LIST = 'GET_PAYMENT_LIST'
export const ADD_PAYMENT = 'ADD_PAYMENT'
export const REMOVE_PAYMENT = 'REMOVE_PAYMENT'
export const EDIT_PAYMENT = 'EDIT_PAYMENT'
export const START_LOADING_PAY = 'START_LOADING_PAY'
export const ERR_PAYMENT = 'ERR_PAYMENT'

export const headerText = (type) => {
    switch(type) {
      case INCOME:
        return 'Добавить доход'
      case EXPENSE:
        return 'Добавить расход'
      default:
        return 'ERROR'
    }
  }