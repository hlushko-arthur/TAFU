export interface ServerResponse {
	status: boolean;
	data: object | [];
}

export interface ServerResponseError {
	status: boolean;
	message: string;
	err?: unknown;
}
