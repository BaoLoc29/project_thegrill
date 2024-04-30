import { createSlice } from '@reduxjs/toolkit'
import { getUserFromLocalStorage } from '../../utils/localstorage';

const initialState = {
    user: getUserFromLocalStorage(),
}
export const userSlide = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
        }
    }
})
export const { login } = userSlide.actions

export default userSlide.reducer