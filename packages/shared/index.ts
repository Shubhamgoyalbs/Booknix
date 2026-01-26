export type wsResponse = {
  type: "NOTIFICATION" | "EVENT_SEAT_UPDATE";
  message: string;
};

export type ClientSigninPayload = {
	accessToken: string;
	refreshToken: string;
	isOrganizer: boolean;
};
