import {
	CardContent,
	CardDescription,
} from "@/components/ui/card.tsx";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { otpGenerateSchema, otpVerifySchema } from "@repo/shared/validation/zod.ts";
import axios from "@/utils/axios.ts";

const AuthOtpPage = () => {
	const [email, setEmail] = useState("");
	const [showOtp, setShowOtp] = useState(false);
	const [otpValue, setOtpValue] = useState("");
	const [issuedAt, setIssuedAt] = useState<number | null>(null);
	const [isDisabled, setIsDisabled] = useState(false);
	const [error, setError] = useState("");
	const [cause, setCause] = useState("");
	const navigate = useNavigate();

	const handleGetOtp = async () => {
		setIsDisabled(true);
		setError("");
		setCause("");

		const result = otpGenerateSchema.safeParse({ email });
		if (!result.success) {
			setCause("InputError");
			setError(result.error.issues[0].message);
			setIsDisabled(false);
			return;
		}

		try {
			const res = await axios.post("/api/auth/otp/generate", { email });
			if (res.status === 200) {
				setIssuedAt(res.data.issuedAt);
				setShowOtp(true);
			}
		} catch (err: any) {
			if (err.response) {
				setCause(err.response.data.error.name);
				setError(err.response.data.error.message || "Failed to send OTP");
			} else {
				setCause("NetworkError");
				setError("Unable to reach server");
			}
		} finally {
			setIsDisabled(false);
		}
	};

	const handleVerify = async () => {
		setIsDisabled(true);
		setError("");
		setCause("");

		const result = otpVerifySchema.safeParse({
			email,
			otp: otpValue,
			issuedAt: issuedAt ?? 0,
		});

		if (!result.success) {
			setCause("InputError");
			setError(result.error.issues[0].message);
			setIsDisabled(false);
			return;
		}

		try {
			const res = await axios.post("/api/auth/otp/verify", {
				email,
				otp: otpValue,
				issuedAt,
			});

			if (res.status === 200) {
				navigate("/auth/signin");
			}
		} catch (err: any) {
			if (err.response) {
				setCause(err.response.data.error.name);
				setError(err.response.data.error.message || "Verification failed");
			} else {
				setCause("NetworkError");
				setError("Unable to reach server");
			}
		} finally {
			setIsDisabled(false);
		}
	};

	const handleResendOtp = async () => {
		setOtpValue("");
		await handleGetOtp();
	};

	const handleUpdateEmail = () => {
		setShowOtp(false);
		setOtpValue("");
		setIssuedAt(null);
		setError("");
		setCause("");
	};

	return (
		<div className="w-full">
			<CardContent className="flex flex-col gap-5">

				<CardDescription className="text-center text-lg text-slate-800 font-semibold">
					Enter your email to get OTP
				</CardDescription>

				<div className="flex flex-col gap-4">

					<div className="flex gap-2 items-center">
						<input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={showOtp || isDisabled}
							className="h-10 flex-1 rounded-md border border-slate-300 px-3 disabled:bg-black/5 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<button
							className={`min-w-fit rounded-md py-2 px-4 transition ${
								isDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
							}`}
							onClick={showOtp ? handleUpdateEmail : handleGetOtp}
							disabled={isDisabled}
						>
							{showOtp ? "Update Email" : "Get OTP"}
						</button>
					</div>

					{showOtp && (
						<div className="flex gap-2 items-center">
							<InputOTP
								maxLength={6}
								value={otpValue}
								onChange={(value) => setOtpValue(value)}
								pattern={REGEXP_ONLY_DIGITS}
								disabled={isDisabled}
							>
								<InputOTPGroup>
									{[0, 1, 2, 3, 4, 5].map((i) => (
										<InputOTPSlot
											key={i}
											index={i}
										/>
									))}
								</InputOTPGroup>
							</InputOTP>

							<button
								className={`rounded-md py-1.5 px-6 transition min-w-fit ${
									isDisabled ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
								}`}
								onClick={handleVerify}
								disabled={isDisabled}
							>
								Verify
							</button>
						</div>
					)}

				</div>

				{error && (
					<div className="border border-red-500 text-red-600 bg-red-50 rounded-md px-3 py-2 text-sm">
						<span className="font-medium">{cause}:</span> {error}
					</div>
				)}

				{showOtp && (
					<div className="flex justify-between items-center text-sm text-slate-500 mt-2">
						<button
							onClick={handleResendOtp}
							disabled={isDisabled}
							className="relative text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full disabled:text-blue-300"
						>
							Resend OTP
						</button>
					</div>
				)}

				<p className="text-center text-sm text-slate-500 mt-2">
					Already verified?{" "}
					<Link
						to="/auth/signin"
						className="relative text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
					>
						Sign in
					</Link>
				</p>

			</CardContent>
		</div>
	);
};

export default AuthOtpPage;
