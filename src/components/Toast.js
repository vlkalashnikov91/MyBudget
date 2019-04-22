import { Toast } from 'native-base'

export const ToastTr = {
    Success: (message) => {
        Toast.show({
            text: message,
            duration: 2500,
            buttonText: "OK",
            position: "bottom",
            type: 'success'
          })
    },
    Danger: (message) => {
        Toast.show({
            text: message,
            duration: 2500,
            buttonText: "OK",
            position: "bottom",
            type: 'danger'
          })
    },
    Warning: (message) => {
        Toast.show({
            text: message,
            duration: 2500,
            buttonText: "OK",
            position: "bottom",
            type: "warning"
          })
    },
    Default: (message) => {
        Toast.show({
            text: message,
            duration:2500,
            buttonText: "OK",
            position: "bottom"
        })
    }
}
