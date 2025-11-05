const POSTGIS_ENABLED = String(process.env.POSTGIS_ENABLED || 'false').toLowerCase() === 'true';

// PUBLIC_INTERFACE
function isPostgisEnabled() {
  /** Whether PostGIS can be used for geospatial queries */
  return POSTGIS_ENABLED;
}

module.exports = { isPostgisEnabled };
