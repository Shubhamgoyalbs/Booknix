import {
	CardAction,
	CardContent,
	CardDescription,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {authSignupSchema} from "@repo/shared/validation/zod.ts";
import axios from "@/utils/axios.ts";

const avatars = [
	"https://ik.imagekit.io/shubham07dev/avatar1",
	"https://ik.imagekit.io/shubham07dev/avatar2",
	"https://ik.imagekit.io/shubham07dev/avatar3",
	"https://ik.imagekit.io/shubham07dev/avatar4",
	"https://ik.imagekit.io/shubham07dev/avatar5",
];

const AuthSignupPage = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState(0);
	const [isDisabled, setIsDisabled] = useState(false);
	const [error, setError] = useState("");
	const [cause, setCause] = useState("");
	const navigate = useNavigate();

	const verifyInput = () => {
		const result = authSignupSchema.safeParse({
			email,
			password,
			firstName,
			lastName,
			profilePicUrl: avatars[selectedAvatar],
		});

		if (!result.success) {
			setCause("InputError");
			setError(result.error.issues[0].message);
			return null;
		}

		setCause("");
		setError("");
		return result.data;
	};


	const handleSignup = async () => {
		setIsDisabled(true);

		const payload = verifyInput();
		if (!payload) {
			setIsDisabled(false);
			return;
		}

		try {
			const res = await axios.post("/api/auth/signup", payload);

			if (res.status === 201) {
				navigate("/auth/signin");
			}

		} catch (err: any) {
			if (err.response) {
				setCause(err.response.data.error.name);
				setError(err.response.data.error.message || "Signup failed");
			} else {
				setCause("NetworkError");
				setError("Unable to reach server");
			}
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<div className="w-full">
			<CardContent className="flex flex-col gap-5">
				<CardDescription className="text-center text-slate-600">
					Welcome back — create your Booknix account
				</CardDescription>

				<div className="flex flex-col gap-4">
					<div className="flex gap-4">
						<div className="flex-1 grid gap-2">
							<Label htmlFor="firstName">First Name</Label>
							<input
								id="firstName"
								type="text"
								placeholder="John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="h-10 w-full rounded-md border border-slate-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>

						<div className="flex-1 grid gap-2">
							<Label htmlFor="lastName">Last Name</Label>
							<input
								id="lastName"
								type="text"
								placeholder="Doe"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="h-10 w-full rounded-md border border-slate-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-10 w-full rounded-md border border-slate-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-10 w-full rounded-md border border-slate-300 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>

					<div className="grid gap-2">
						<Label>Avatar</Label>
						<div className="flex items-center gap-4">
							<Avatar className="ring-2 ring-blue-500 ring-offset-2">
								<AvatarImage src={avatars[selectedAvatar]} />
								<AvatarFallback>AV</AvatarFallback>
							</Avatar>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="w-full border border-blue-500 text-blue-500 rounded-md py-2 hover:bg-blue-50 transition">
										Select avatar
									</button>
								</DropdownMenuTrigger>

								<DropdownMenuContent>
									{avatars.map((avatar, index) => (
										<DropdownMenuItem
											key={index}
											onClick={() => setSelectedAvatar(index)}
											className={`flex items-center gap-3 cursor-pointer ${
												selectedAvatar === index ? "bg-blue-50" : ""
											}`}
										>
											<Avatar>
												<AvatarImage src={avatar} />
												<AvatarFallback>AV</AvatarFallback>
											</Avatar>
											Avatar {index + 1}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<CardAction className='w-full'>
						<button
							type="button"
							disabled={isDisabled}
							onClick={handleSignup}
							className={`
					      w-full rounded-md py-2.5 text-center transition-all duration-300
					      ${
									isDisabled
										? "bg-blue-300 cursor-not-allowed text-white"
										: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow"
								}
					    `}
						>
							Sign Up
						</button>
					</CardAction>


					{error && (
						<div className="border border-red-500 text-red-600 bg-red-50 rounded-md px-3 py-2 text-sm">
							<span className="font-medium">{cause}:</span> {error}
						</div>
					)}

					<p className="text-center text-sm text-slate-500">
						Already have an account?{" "}
						<Link
							to="/auth/signin"
							className="relative text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
						>
							Sign in
						</Link>
					</p>
				</div>
			</CardContent>
		</div>
	);
};

export default AuthSignupPage;
