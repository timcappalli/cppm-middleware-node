# CPPM Middleware Node.js
Node middleware for various integrations with Aruba CPPM

**Current Version**: 2021.06.11

## Current Use Cases
### CPPM Outbound
* Get CPPM active sessions (`/cppm/session-count`)
* Check if session is active (`/cppm/session-check?field=sessionfieldname&value=sessionfieldvalue`)

### CPPM Inbound
* Send Pushover Message w/ rate limiting (`/pushover/send-message`)
* Update Home Assistant presence (`/hass/presence-update`)


## ENVs
`CPPM_FQDN`: REQUIRED, string, CPPM FQDN

`CPPM_CLIENT_ID`: REQUIRED, string, CPPM OAuth client ID

`CPPM_CLIENT_SECRET`: REQUIRED, string, CPPM OAuth client secret

`HASS_TOKEN`: REQUIRED, string, Home Assistant Token (JWT)

`HASS_FQDN`: REQUIRED, string, Home Assistant FQDN

`APP_USERNAME`: Optional, string, username for HTTP Basic Auth (auth enabled when both username and password are set)

`APP_PASSWORD`: Optional, string, password for HTTP Basic Auth (auth enabled when both username and password are set)

`APP_DEBUG`: Optional, boolean, Default: false

`APP_PORT`: Optional, integer, Default: 5031
