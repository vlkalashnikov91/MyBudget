/* С заглавной буквы */
export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/* Разрадность в суммах */
export const SummMask = (string) => {
    return string.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

/* Удаляем пробелы в суммах */
export const ClearNums = (value) => {
    return value.replace(/\s+/g, '')
}

/* Валидация мыла */
export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
}

/* Только числа */
export const onlyNumbers = (str) => {
    var re = /^[\d]+$/
    return re.test(str)
}

/* Только цифры и буквы */
export const charAndNums = (str) => {
    var re = /^[\w]+$/
    return re.test(str)
}