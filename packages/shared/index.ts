export type wsResponse = {
  type: "NOTIFICATION" | "EVENT_SEAT_UPDATE";
  message: string;
};
