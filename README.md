# CPPM Middleware Node.js
Node middleware for various integrations with Aruba CPPM

**Current Version**: 2021.01.31

## Current Use Cases
### CPPM Outbound
* Get CPPM active sessions (/cppm/session-count)

### CPPM Inbound
* Send Pushover Message w/ rate limiting (/pushover/send-message)
* Update Home Assistant presence (/hass/presence-update)


## ENVs
`CPPM_FQDN`: REQUIRED, string, CPPM FQDN

`CPPM_CLIENT_ID`: REQUIRED, string, CPPM OAuth client ID

`CPPM_CLIENT_SECRET`: REQUIRED, string, CPPM OAuth client secret

`HASS_TOKEN`: REQUIRED, string, Home Assistant Token (JWT)

`HASS_FQDN`: REQUIRED, string, Home Assistant FQDN

`APP_USERNAME`: REQUIRED, string, username for HTTP Basic Auth

`APP_PASSWORD`: REQUIRED, string, password for HTTP Basic Auth

`APP_DEBUG`: Optional, boolean, Default: false

`APP_PORT`: Optional, integer, Default: 5031
