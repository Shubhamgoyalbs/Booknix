import {Card, CardHeader} from "@/components/ui/card.tsx";
import {Outlet} from "react-router-dom";

const AuthPageLayout = () => {

	return (
		<div className="min-h-screen w-full flex flex-col overflow-hidden bg-[#56ACE5]/2">

			<div className="flex-1 flex items-center justify-center">
					<Card className="max-w-md w-full flex flex-col justify-between h-fit mx-3 pt-0 pb-6 px-3bg-white rounded-lg shadow-xl overflow-hidden border border-blue-100">
						<div className="h-1.5 bg-gradient-to-r from-primary to-blue-500"></div>
						<CardHeader >
							<img
								src="/BooknixLogo.svg"
								alt="Booknix Logo"
								className="h-14 mx-auto my-0 object-contain"
							/>
						</CardHeader>
						<Outlet />
					</Card>
			</div>
			<div className="text-center mt-8">
				<p className="text-gray-500 text-xs">
					© {new Date().getFullYear()} Booknix. All rights reserved.
				</p>
			</div>

		</div>
	);
};

export default AuthPageLayout;
