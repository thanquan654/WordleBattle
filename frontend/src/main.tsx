import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { store } from '@/store/store'
import { Provider } from 'react-redux'
// Routing
import HomePage from './page/HomePage.tsx'
import LobbyScreen from '@/page/LobbyScreen.tsx'
import GameScreen from '@/page/GameScreen.tsx'
import ResultScreen from '@/page/ResultScreen.tsx'
import NotFoundPage from '@/page/NotFoundPage.tsx'

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="lobby/:roomId" element={<LobbyScreen />} />
				<Route path="game/:roomId" element={<GameScreen />} />
				<Route path="result/:roomId" element={<ResultScreen />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	</Provider>,
)
