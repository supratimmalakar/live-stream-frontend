import { configureStore } from '@reduxjs/toolkit'
import streamReducer from './slice'

export const store = configureStore({
    reducer: {
        stream: streamReducer,
    },
})