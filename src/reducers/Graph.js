import { START_LOADING_GRAPH, GET_GRAPH_DATA, ERR_REQUEST_GRAPH } from '../constants/Graph'

const initialeState = {
    GraphData: [],
    isLoad: false,
    Error: ''
}

export default (state = initialeState, action) => {
    switch (action.type) {
        case ERR_REQUEST_GRAPH:
            return {...state,
                isLoad: false,
                Error: action.payload.err
            }
        case START_LOADING_GRAPH:
            return {...state,
                isLoad: true,
                Error: '',
                GraphData: []
            }
        case GET_GRAPH_DATA:
            return {...state,
                GraphData: action.payload.data,
                isLoad: false,
                Error: ''
            }
        default:
            return state
    }
}