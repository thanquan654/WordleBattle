import { configureStore } from '@reduxjs/toolkit'
import roomReducer from './RoomSlice'
import gameReducer from './GameSlice'

export const store = configureStore({
	reducer: {
		room: roomReducer,
		game: gameReducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
