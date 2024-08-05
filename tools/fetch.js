export default class HTTP {
	static async send(url, method, body, callback) {
		const request_data = {
			method: method,
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Basic ${btoa('tipsspain:checkngo1980')}`
			},
		};

		if (body) {
			request_data.body = JSON.stringify(body);
		}

		const response = await fetch(url, request_data);

		const json = await response.json();

		callback(json);

		return json;
	}

	static build_url(url, params) {
		const url_params = new URLSearchParams(params).toString();

		return `${url}?${url_params}`;
	}
}
