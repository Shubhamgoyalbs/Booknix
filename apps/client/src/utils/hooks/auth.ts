import { useState } from "react";
import type {ClientSigninPayload} from "@repo/shared/index.ts";

export function useAuth() {
	const [accessToken, setAccessToken] = useState<string | null>(() =>
		localStorage.getItem("accessToken")
	);

	const [refreshToken, setRefreshToken] = useState<string | null>(() =>
		localStorage.getItem("refreshToken")
	);

	const [isOrganizer, setIsOrganizer] = useState<boolean>(() =>
		localStorage.getItem("isOrganizer") === "true"
	);

	const signIn = (data: ClientSigninPayload) => {
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("refreshToken", data.refreshToken);
		localStorage.setItem("isOrganizer", String(data.isOrganizer));

		setAccessToken(data.accessToken);
		setRefreshToken(data.refreshToken);
		setIsOrganizer(data.isOrganizer);

	};

	const logout = () => {
		setAccessToken(null);
		setRefreshToken(null);
		setIsOrganizer(false);

		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("isOrganizer");
	};

	return {
		accessToken,
		refreshToken,
		isOrganizer,
		signIn,
		logout,
	};
}
