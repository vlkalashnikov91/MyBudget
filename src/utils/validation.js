export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
}

export const onlyNumbers = (str) => {
    var re = /^[\d]+$/
    return re.test(str)
}

export const charAndNums = (str) => {
    var re = /^[\w]+$/
    return re.test(str)
}