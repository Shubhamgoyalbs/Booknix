import "./App.css";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LandingPage from "@/components/pages/Landing.tsx";
import PageNotFound from "@/components/pages/NotFound.tsx";
import UserPageLayout from "@/components/layouts/User.tsx";
import UserHomePage from "@/components/pages/user/Home.tsx";
import OrganizerPageLayout from "@/components/layouts/Organizer.tsx";
import OrganizerHomePage from "@/components/pages/organizer/Home.tsx";
import AuthPageLayout from "@/components/layouts/Auth.tsx";
import AuthSigninPage from "@/components/pages/auth/Signin.tsx";
import AuthSignupPage from "@/components/pages/auth/Signup.tsx";
import AuthOtpPage from "@/components/pages/auth/otp.tsx";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/user" element={<UserPageLayout />}>
					<Route index element={<Navigate to="home" replace />} />
					<Route path='home' element={<UserHomePage />} />
				</Route>
				<Route path="/organizer" element={<OrganizerPageLayout />}>
					<Route index element={<OrganizerHomePage />} />
				</Route>
				<Route path="/auth" element={<AuthPageLayout />}>
					<Route index element={<Navigate to="signin" replace />} />
					<Route path='signin' element={<AuthSigninPage />} />
					<Route path='signup' element={<AuthSignupPage />} />
					<Route path='otp' element={<AuthOtpPage />} />
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
