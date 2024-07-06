interface ValidationError {
	type: string;
	value: string;
	msg: string;
	path: string;
	location: string;
}

interface ValidationErrorResponse {
	errors: ValidationError[];
}

export type AxiosErrorResponseData = {
	data: ValidationErrorResponse;
	status: number;
	statusText: string;
	headers: {
		"cache-control": string;
		"content-length": string;
		"content-type": string;
	};
	config: {
		transitional: {
			silentJSONParsing: boolean;
			forcedJSONParsing: boolean;
			clarifyTimeoutError: boolean;
		};
		adapter: string[];
		transformRequest: (null | ((data: any, headers?: any) => any))[];
		transformResponse: (null | ((data: any, headers?: any) => any))[];
		timeout: number;
		xsrfCookieName: string;
		xsrfHeaderName: string;
		maxContentLength: number;
		maxBodyLength: number;
		env: Record<string, any>;
		headers: {
			Accept: string;
			"Content-Type": string;
			authorization: string;
		};
		baseURL: string;
		method: string;
		url: string;
		data: string;
	};
	request: object;
};
export type ErrorResponse = {
	path: string;
	msg: string;
};

export type { ValidationErrorResponse, ValidationError };
