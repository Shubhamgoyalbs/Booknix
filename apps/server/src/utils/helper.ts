import prismaClient from "@repo/db/client";
import { HTTPException } from "hono/http-exception";

export const getUserIdHelper = async (email: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      verified: true,
    },
  });

  if (!user) {
    throw new HTTPException(
			400,
	    {
				cause: 'InputError',
		    message: "User with this email doesn't exists"
	    }
    );
  }

  if (user.verified) {
    throw new HTTPException(
	    400,
	    {
		    cause: 'InputError',
		    message: "User is already verified"
	    }
    );
  }

  return user.id;
};
