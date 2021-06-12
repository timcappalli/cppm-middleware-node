const axios = require('axios');
const qs = require('qs');

const cppmOauthConfig = {
	client: {
		id: process.env.CPPM_CLIENT_ID,
		secret: process.env.CPPM_CLIENT_SECRET
	},
	auth: {
		tokenHost: `https://${process.env.CPPM_FQDN}/`,
		tokenPath: 'api/oauth'
	},
	options: {
		bodyFormat: "form",
		authorizationMethod: "body"
	}
};

const cppmClientCredentials = {
	client_id: process.env.CPPM_CLIENT_ID,
	client_secret: process.env.CPPM_CLIENT_SECRET,
	url: `https://${process.env.CPPM_FQDN}/api/oauth`
};

function CachedCppmToken() {
	this.accessToken = null,
		this.expiresIn = 0,
		this.expiresTime = 0,
		this.resource = null
};

const cachedCppmToken = new CachedCppmToken();

async function getCppmToken() {
	const d = new Date();
	const seconds = Math.round(d.getTime() / 1000);
	const secondsOffset = 60;
	if (seconds > cachedCppmToken.expiresTime) {
		try {
			var tokenData = await fetchCppmToken();
			cachedCppmToken.accessToken = tokenData.access_token;
			cachedCppmToken.expiresIn = tokenData.expires_in;
			cachedCppmToken.expiresTime = (seconds + tokenData.expires_in) - secondsOffset;
			cachedCppmToken.resource = `https://${process.env.CPPM_FQDN}`;
		} catch {
			console.error("Could not get CPPM access token.");
			return null;
		}
	};
	return cachedCppmToken.accessToken;
};

async function fetchCppmToken() {
	const config = {
		timeout: 10000,
		method: 'post',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		url: `https://${process.env.CPPM_FQDN}/api/oauth`,
		data: qs.stringify({
			client_id: process.env.CPPM_CLIENT_ID,
			client_secret: process.env.CPPM_CLIENT_SECRET,
			grant_type: 'client_credentials'
		})
	};
	return axios.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error(err.response.data);
		});
};

async function fetchCppmSessionCount() {
	let token = await getCppmToken();
	const config = {
		timeout: 10000,
		method: 'get',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		params: { 'calculate_count': 'true', 'limit': 1, 'filter': { 'acctstoptime': { '$exists': false } } },
		url: `https://${process.env.CPPM_FQDN}/api/session`,
	};
	return axios.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			console.error(err.response.data);
		});
};

async function activeCppmSession(field, value) {
	let token = await getCppmToken();

	filterData = {};
	filterData[field] = value;

	const config = {
		timeout: 10000,
		method: 'get',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		params: { 'calculate_count': 'true', 'limit': 1, 'filter': { '$and': [ filterData, { 'acctstoptime': { '$exists': false } }] } },
		url: `https://${process.env.CPPM_FQDN}/api/session`,
	};
	return axios.request(config)
		.then((response) => {
			if (response.data.count === 0) {
				return false;
			} else {
				return true;
			}
		})
		.catch((err) => {
			console.error(err.response.data);
		});
};

module.exports = { fetchCppmSessionCount, activeCppmSession };