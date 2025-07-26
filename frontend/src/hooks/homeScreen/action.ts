import { createRoom, getRoomInfo, joinARoom } from '@/apis/apiService'
import {
	setCurrentPlayerId,
	setRoomId as setRoomIdAction,
} from '@/store/RoomSlice'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

export const useHomeAction = () => {
	// Utils
	const dispatch = useDispatch()
	const navigator = useNavigate()

	// State
	const [errors, setErrors] = useState({
		quickPlay: '',
		searchRoom: '',
	})
	const [isLoading, setLoading] = useState(false)

	const handleQuickPlay = async (userName: string): Promise<boolean> => {
		setErrors({
			quickPlay: '',
			searchRoom: '',
		})
		setLoading(true)

		const userId = localStorage.getItem('userId') ?? uuidv4()
		const respone = await createRoom(userId, userName)

		setLoading(false)

		if (respone?.status === 200) {
			dispatch(setCurrentPlayerId(userId))
			dispatch(setRoomIdAction(respone.data.roomId))

			localStorage.setItem('userId', userId)
			localStorage.setItem('name', userName)

			navigator('/lobby/' + respone.data.roomId)
			return true
		}

		setErrors((prev) => ({
			...prev,
			quickPlay: 'Có lỗi xảy ra trong quá trình tạo phòng mới',
		}))
		return false
	}
	const handleSearchRoom = async (
		roomId: string,
		userName: string,
	): Promise<boolean> => {
		setErrors({
			quickPlay: '',
			searchRoom: '',
		})
		setLoading(true)

		const respone = await getRoomInfo(roomId)

		if (respone?.status === 200) {
			const userId = localStorage.getItem('userId') ?? uuidv4()
			localStorage.setItem('userId', userId)
			localStorage.setItem('name', userName)

			const respone = await joinARoom(roomId, {
				id: userId,
				name: userName,
				isBot: false,
			})

			if (respone?.status === 200) {
				dispatch(setRoomIdAction(respone?.data.roomId))

				navigator('/lobby/' + respone?.data.roomId)
				return true
			} else if (respone?.status === 404) {
				setErrors((prev) => ({
					...prev,
					searchRoom: 'Phòng không tồn tại hoặc đang chơi',
				}))
				return false
			}
		}

		setLoading(false)

		setErrors((prev) => ({
			...prev,
			searchRoom: 'Có lỗi xảy ra trong quá trình tìm phòng',
		}))
		return false
	}

	return {
		errors,
		isLoading,
		handleQuickPlay,
		handleSearchRoom,
	}
}
