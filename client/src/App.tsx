/** @format */
import { AppSidebar } from "./components/whatsapp-sidebar";
import { SidebarProvider } from "./components/sidebar";
import "./App.css";

function App() {
	return (
		<div className='App bg-linear-to-br min-h-screen from-slate-900 via-slate-800 to-slate-900'>
			<SidebarProvider>
				<AppSidebar></AppSidebar>
			</SidebarProvider>
		</div>
	);
}

export default App;
