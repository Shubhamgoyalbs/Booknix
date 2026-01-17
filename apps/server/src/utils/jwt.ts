import jwt from 'jsonwebtoken';
import type {DecodedJwtPayload, JwtPayload, JwtTokenPair} from '../../types/type.ts'

const REFRESH_TOKEN_SECRET: string =
	process.env.REFRESH_TOKEN_SECRET ||
	'b71003c6a91b88a2862f60de643b114705f0d64be4ccd779b8073415b208caed2f509a7634391dd60697c121c873b57f1341571ceefbe42205ff12ad074a6080';

const REFRESH_TOKEN_EXPIRES_IN: string =
	process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const ACCESS_TOKEN_SECRET: string =
	process.env.ACCESS_TOKEN_SECRET ||
	'acb702ae75b06f0e1e585df77660368bd8cffcf8005b48d5ec098551449795aa88324e0c69dcd3dae258d3b5b210f302109f62791d7381b2b800f3950b91d74d';

const ACCESS_TOKEN_EXPIRES_IN: string =
	process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';

export const verifyAccessToken = (
	accessToken: string
): JwtPayload | null => {
	try {
		const decoded = jwt.verify(
			accessToken,
			ACCESS_TOKEN_SECRET
		) as DecodedJwtPayload;

		return {
			userId: decoded.userId,
			email: decoded.email,
		};
	} catch (error) {
		console.error('Access token verification failed:', error);
		return null;
	}
};

export const verifyRefreshToken = (
	refreshToken: string
): JwtPayload | null => {
	try {
		const decoded = jwt.verify(
			refreshToken,
			REFRESH_TOKEN_SECRET
		) as DecodedJwtPayload;

		return {
			userId: decoded.userId,
			email: decoded.email,
		};
	} catch (error) {
		console.error('Refresh token verification failed:', error);
		return null;
	}
};

export const generateTokens = (payload: JwtPayload): JwtTokenPair => {
	const accessToken = jwt.sign(
		payload,
		ACCESS_TOKEN_SECRET,
		{
			expiresIn: ACCESS_TOKEN_EXPIRES_IN,
		} as jwt.SignOptions
	);

	const refreshToken = jwt.sign(
		payload,
		REFRESH_TOKEN_SECRET,
		{
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		} as jwt.SignOptions
	);

	return {
		accessToken,
		refreshToken,
	};
};
