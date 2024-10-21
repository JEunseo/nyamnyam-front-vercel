
declare namespace kakao.maps {
    class LatLng {
        constructor(lat: number, lng: number);
    }

    class Map {
        constructor(container: HTMLElement, options: MapOptions);
        setCenter(center: LatLng): void;
    }

    class Marker {
        constructor(options: MarkerOptions);
    }

    class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, marker: Marker): void;
    }

    class services {
        static Geocoder: GeocoderStatic;
        static Status: {
            OK: string;
        };
    }

    interface MapOptions {
        center: LatLng;
        level: number;
    }

    interface MarkerOptions {
        map: Map;
        position: LatLng;
    }

    interface InfoWindowOptions {
        content: string;
    }

    interface GeocoderStatic {
        addressSearch(address: string, callback: (result: any[], status: string) => void): void;
    }
}
