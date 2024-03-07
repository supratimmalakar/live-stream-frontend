import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    socket: null,
    streamId: null,
}

export const streamSlice = createSlice({
    name: 'stream',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setStreamId: (state, action) => {
            state.streamId = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSocket, setStreamId } = streamSlice.actions

export default streamSlice.reducer