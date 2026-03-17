/** @format */
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import HomeContent from "./components/home-content";
import Dashboard from "./components/dashbord";
import "./App.css";

function App() {
	return (
		<div className='App bg-linear-to-br min-h-screen from-slate-900 via-slate-800 to-slate-900'>
			<Routes>
				<Route element={<Layout />}>
					<Route path='/' element={<HomeContent />} />
					<Route path='/dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
