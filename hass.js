const axios = require('axios');

async function updateHassPresence(hassEntityId, state) {
	const config = {
		timeout: 10000,
		method: 'post',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.HASS_TOKEN}` },
		data: { 'state': state},
		url: `https://${process.env.HASS_FQDN}/api/states/${hassEntityId}`,
	};
	return axios.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.log(err.response.data);
		});
};

module.exports = { updateHassPresence };