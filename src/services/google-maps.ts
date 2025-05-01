/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Retrieves a Google Maps URL for a given location or address.
 *
 * @param locationOrAddress The location object or address string.
 * @returns A Google Maps URL.
 */
export async function getGoogleMapsUrl(locationOrAddress: Location | string): Promise<string> {
  // TODO: Implement this by calling an API.

  const address = typeof locationOrAddress === 'string' ? locationOrAddress : `${locationOrAddress.lat},${locationOrAddress.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
