import {
	CardAction,
	CardContent,
	CardDescription,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {authSigninSchema} from "@repo/shared/validation/zod.ts";
import axios from "@/utils/axios.ts";
import {useAuth} from "@/utils/hooks/auth.ts";

const AuthSigninPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);
	const [error, setError] = useState("");
	const [name, setName] = useState("");
	const navigate = useNavigate();
	const auth = useAuth();

	const verifyInput = () => {
		const result = authSigninSchema.safeParse({
			email,
			password,
		});

		if (!result.success) {
			setName("InputError");
			setError(result.error.issues[0].message);
			return null;
		}

		setName("");
		setError("");
		return result.data;
	};


	const handleSignin = async () => {
		setIsDisabled(true);

		const payload = verifyInput();
		if (!payload) {
			setIsDisabled(false);
			return;
		}

		try {
			const res = await axios.post("/api/auth/signin", payload);
			if (res.status === 201) {
				auth.signIn(res.data.data)
				console.log(res.data.data)
				navigate("/user/home");
			}

		} catch (err: any) {
			if (err.response) {
				setName(err.response.data.error.name);
				setError(err.response.data.error.message || "Signin failed");
			} else {
				setName("NetworkError");
				setError("Unable to reach server");
			}
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<div className="w-full">
			<CardContent className="flex flex-col gap-5">

				<CardDescription className="text-center text-lg text-slate-800 font-semibold">
					Welcome back! Sign in to continue.
				</CardDescription>

				<div className="flex flex-col gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-10 rounded-md border border-slate-300 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>
				</div>

				<CardAction className='w-full'>
					<button
						type="button"
						disabled={isDisabled}
						onClick={handleSignin}
						className={`
					      w-full rounded-md py-2.5 text-center transition-all duration-300
					      ${
							isDisabled
								? "bg-blue-300 cursor-not-allowed text-white"
								: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow"
						}
					    `}
					>
						Sign In
					</button>
				</CardAction>

				{error && (
					<div className="border border-red-500 text-red-600 bg-red-50 rounded-md px-3 py-2 text-sm">
						<span className="font-medium">{name}:</span> {error}
					</div>
				)}

				<div className="flex items-center my-2">
					<div className="flex-1 h-[0.5px] bg-black/30"></div>
					<span className="px-2 text-slate-400 text-sm font-medium">OR</span>
					<div className="flex-1 h-[0.5px] bg-black/30"></div>
				</div>

				<CardAction
					onClick={() => navigate("/auth/otp")}
					className="w-full cursor-pointer text-center border border-blue-500 text-blue-500 bg-white rounded-md py-2 hover:bg-blue-50 transition"
				>
					Verify with OTP
				</CardAction>

				<p className="text-center text-sm text-slate-500">
					Don’t have an account?{" "}
					<Link
						to="/auth/signup"
						className="relative text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
					>
						Sign up
					</Link>
				</p>

			</CardContent>
		</div>
	);
};

export default AuthSigninPage;
