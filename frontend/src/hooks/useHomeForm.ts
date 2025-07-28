import { useState } from 'react'

export const useHomeForm = () => {
	const [userName, setUserName] = useState<string>(
		localStorage.getItem('name') ?? '',
	)
	const [roomId, setRoomId] = useState<string>('')
	const [errors, setErrors] = useState({
		userName: '',
		roomId: '',
	})

	const validateForm = (mode: 'quickPlay' | 'searchRoom') => {
		let isValid = true
		setErrors({
			userName: '',
			roomId: '',
		})

		if (!userName) {
			setErrors((prev) => ({
				...prev,
				userName: 'Vui lòng nhập tên trước khi chơi',
			}))
			isValid = false
		}

		if ((!roomId || roomId.length !== 4) && mode === 'searchRoom') {
			setErrors((prev) => ({
				...prev,
				roomId: 'Mã phòng có độ dài 4 ký tự',
			}))
			isValid = false
		}

		return isValid
	}

	return {
		userName,
		setUserName,
		roomId,
		setRoomId,
		errors,
		setErrors,
		validateForm,
	}
}
