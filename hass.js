const axios = require('axios');

async function updateHassPresence(payload) {
	const config = {
		timeout: 10000,
		method: 'post',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.HASS_TOKEN}` },
		data: payload,
		url: `https://${process.env.HASS_FQDN}/api/states/${payload.entity_id}`,
	};
	return axios.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error(err.response.data);
		});
};

module.exports = { updateHassPresence };