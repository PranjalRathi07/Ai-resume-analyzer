/** @format */
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import { AnimatePresence } from "framer-motion";
import HomeContent from "./components/home-content";
import Dashboard from "./components/dashbord";
import CareerPath from "./components/Career-path";
import "./App.css";

function App() {
	return (
		<div className='App h-dvh overflow-y-auto bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 scroll-smooth no-scrollbar'>
			<AnimatePresence mode='wait'>
				<Routes>
					<Route element={<Layout />}>
						<Route path='/' element={<HomeContent />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/career-path' element={<CareerPath />} />
					</Route>
				</Routes>
			</AnimatePresence>
		</div>
	);
}

export default App;
