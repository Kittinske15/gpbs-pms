import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {

    },
    reducers: {
        setUser: (state, action) => {
            const newUser = action.payload.user
            return newUser
        },
        resetUser: (state) => {
            return {}
        },
    },
})

export const { setUser, resetUser } = userSlice.actions

export default userSlice.reducer