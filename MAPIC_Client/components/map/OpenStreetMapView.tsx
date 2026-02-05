import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Marker {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  color?: string;
  type?: 'friend' | 'place' | 'user';
}

interface OpenStreetMapViewProps {
  latitude: number;
  longitude: number;
  markers?: Marker[];
  showUserLocation?: boolean;
  onRegionChange?: (region: any) => void;
  style?: any;
}

export default function OpenStreetMapView({
  latitude,
  longitude,
  markers = [],
  showUserLocation = true,
  style,
}: OpenStreetMapViewProps) {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        ${showUserLocation ? `
        var userIcon = L.divIcon({
          className: 'user-marker',
          html: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([${latitude}, ${longitude}], { icon: userIcon })
          .addTo(map)
          .bindPopup('You are here');
        ` : ''}

        ${markers.map((marker, index) => {
          let iconHtml = '';
          if (marker.type === 'friend') {
            iconHtml = '<div style="background: #34D399; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
          } else if (marker.type === 'place') {
            iconHtml = '<div style="background: #F59E0B; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
          } else {
            iconHtml = '<div style="background: #EF4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
          }
          
          return `
        var icon${index} = L.divIcon({
          className: 'marker-${marker.type || 'default'}',
          html: '${iconHtml}',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        var marker${index} = L.marker([${marker.latitude}, ${marker.longitude}], { icon: icon${index} })
          .addTo(map);
        ${marker.title ? `marker${index}.bindPopup('${marker.title}${marker.description ? '<br>' + marker.description : ''}');` : ''}
        `;
        }).join('\n')}

        // Update markers function
        window.updateMarkers = function(newMarkers) {
          // Clear existing markers except user location
          map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && !layer.options.isUser) {
              map.removeLayer(layer);
            }
          });
          
          // Add new markers with custom icons
          newMarkers.forEach(function(marker, index) {
            var iconHtml = '';
            if (marker.type === 'friend') {
              iconHtml = '<div style="background: #34D399; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
            } else if (marker.type === 'place') {
              iconHtml = '<div style="background: #F59E0B; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
            } else {
              iconHtml = '<div style="background: #EF4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
            }
            
            var customIcon = L.divIcon({
              className: 'marker-' + (marker.type || 'default'),
              html: iconHtml,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });
            
            L.marker([marker.latitude, marker.longitude], { icon: customIcon })
              .addTo(map)
              .bindPopup(marker.title + (marker.description ? '<br>' + marker.description : '') || '');
          });
        };

        // Center map function
        window.centerMap = function(lat, lng) {
          map.setView([lat, lng], 15);
        };
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current && markers.length > 0) {
      const markersJson = JSON.stringify(markers);
      webViewRef.current.injectJavaScript(`
        window.updateMarkers(${markersJson});
        true;
      `);
    }
  }, [markers]);

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.centerMap(${latitude}, ${longitude});
        true;
      `);
    }
  }, [latitude, longitude]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
