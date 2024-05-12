// Function to calculate latitude and longitude of points along the circumference of a circle
export function computeCircleAlertBounds(centerLng, centerLat, distance) {
  function calculateDestination(lon, lat, bearing) {
    const radius = 6371; // Earth radius in kilometers
    const lat1 = lat * (Math.PI / 180);
    const lon1 = lon * (Math.PI / 180);
    const angularDistance = distance / radius;
    const bearingRad = bearing * (Math.PI / 180);

    let lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angularDistance) +
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRad)
    );
    let lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
      );

    lat2 = lat2 * (180 / Math.PI);
    lon2 = lon2 * (180 / Math.PI);

    return [lat2, lon2];
  }

  let circumference = [];

  for (let i = 0; i < 360; i++) {
    if (i % 6 == 0) {
      circumference.push(calculateDestination(centerLng, centerLat, i));
    }
  }

  return circumference;
}

export function alertStatus(dateEffective, dateExpires) {
  if (new Date() > Date.parse(dateExpires)) {
    return "expired";
  } else if (new Date() < Date.parse(dateEffective)) {
    return "scheduled";
  }

  return "active";
}

export function calculateCenter(coordinates) {
    const numPoints = coordinates.length;
    let totalLat = 0;
    let totalLon = 0;

    for (const point of coordinates) {
        totalLon += point[0]; // Latitude is the first element
        totalLat += point[1]; // Longitude is the second element
    }

    const centerLat = totalLat / numPoints;
    const centerLon = totalLon / numPoints;

    return [centerLon, centerLat];
}