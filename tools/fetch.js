export default class HTTP {
	static async send(url, params, callback) {
		const request_data = {
			...params,
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

		return `https://crm.checkngo.pro${url}?${url_params}`;
	}
}
