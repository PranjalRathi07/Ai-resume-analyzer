/** @format */
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import { AnimatePresence } from "framer-motion";
import HomeContent from "./components/home-content";
import Dashboard from "./components/dashbord";
import CareerPath from "./components/Career-path";
import LearningPath from "./components/Learning_path";
import LoginPage from "./components/Login_page";
import CoverLetter from "./components/Cover_letter";
import "./App.css";

function App() {
	return (
		<div className='App h-dvh overflow-y-auto bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 scroll-smooth no-scrollbar'>
			<AnimatePresence mode='wait'>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route element={<Layout />}>
						<Route path='/' element={<HomeContent />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/career-path' element={<CareerPath />} />
						<Route path='/learning-path' element={<LearningPath />} />
						<Route path='/cover-letter' element={<CoverLetter />} />
					</Route>
				</Routes>
			</AnimatePresence>
		</div>
	);
}

export default App;
