setSkey = (username, password) => {
    let skey = ''
    skey = GetAuthUser(username, password)

    AsyncStorage.setItem('sKey', skey)
    this.setState({skey: skey})
  }

  checkSkey() {
    AsyncStorage.getItem('sKey').then((value) => {
      var isEx = CheckUserSkey(value)
      if (isEx) {
        this.setState({skey: value})
      } else {
        this.setState({skey: ''})
      }
    })
  }

  deleteSkey() {
    AsyncStorage.removeItem('sKey')
    this.setState({skey:''})
  }
