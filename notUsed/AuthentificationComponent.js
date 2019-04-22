import React from 'react'
import { AsyncStorage } from 'react-native'
import LoginScreen from './screens/LoginScreen'

export default function requireAuth(Component) {
    class AuthentificationComponent extends React.Component {
        
        componentWillMount() {
            this.isLoggedIn = false
            this.checkAuth()
        }

        componentWillUpdate() {
            
            console.log("componentWillUpdate")

            this.checkAuth()
        }

        checkAuth() {
            try {
                AsyncStorage.getItem("sKey").then((value) => {
                    if (value.length > 0) {
                        console.log("зашел")
                        /*console.log(this)
                        this.isLoggedIn = true

                        console.log(this)*/

                    }
                }).done();

            } catch(e) {
                console.log(e.message)

                this.isLoggedIn = false
            }
        }
        
        render() {
            /*console.log("this.isLoggedIn")
            console.log(this)*/

            return this.isLoggedIn
            ? <Component {...this.props }/>
            : <LoginScreen {...this.props } />
        }
    }

    return AuthentificationComponent
}