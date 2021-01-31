const axios = require('axios');


async function sendPushoverMessage(data) {
    const config = {
        timeout: 10000,
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data,
        url: `https://api.pushover.net/1/messages.json?html=1`,
    };
    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.error(err.response.data);
        });
};

module.exports = { sendPushoverMessage };