export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface DataPoint extends Coordinates {
    radius: number;
    id: String;
}

export class MapFunction {

    constructor() {}

    calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        const earthRadiusKm = 6371;
    
        const lat1Rad = this.toRadians(coord1.latitude);
        const lat2Rad = this.toRadians(coord2.latitude);
        const latDiffRad = this.toRadians(coord2.latitude - coord1.latitude);
        const lonDiffRad = this.toRadians(coord2.longitude - coord1.longitude);
    
        const a = Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(lonDiffRad / 2) * Math.sin(lonDiffRad / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;
    
        return distance;
    }
    
    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
    
    filterDataByRadius(alerts: any[], center: any, centerRadius: number): any[] {
        const filteredAlerts = alerts.filter((alert) => {
            const alertRadius = alert.radius || 0; // Assuming each alert might have a 'radius' property
            const distance = this.calculateDistance(center, {
                latitude: parseFloat(alert.location[0][1].toString()),
                longitude: parseFloat(alert.location[0][0].toString())
            });
            // Include the sum of both radii in the distance comparison
            return distance <= (centerRadius + alertRadius);
        });

        return filteredAlerts;
    }
}
