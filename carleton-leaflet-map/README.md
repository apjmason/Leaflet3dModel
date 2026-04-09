# Carleton College Leaflet Map

This project is a web application that displays an interactive map of Carleton College in Northfield, MN, using the Leaflet library. The map includes markers for each building on campus, providing users with an easy way to explore the college's facilities.

## Project Structure

```
carleton-leaflet-map
├── public
│   ├── index.html        # Main HTML document
│   ├── css
│   │   └── styles.css    # Styles for the webpage
│   └── js
│       └── map.js        # JavaScript for initializing the Leaflet map
├── src
│   └── data
│       └── buildings.geojson # GeoJSON data for campus buildings
├── package.json           # npm configuration file
├── .gitignore             # Files and directories to ignore in Git
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd carleton-leaflet-map
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the Application**
   You can use a local server to view the application. For example, you can use the `live-server` package:
   ```bash
   npx live-server public
   ```

4. **Open in Browser**
   Navigate to `http://localhost:8080` (or the port specified by your server) to view the map.

## Functionality

- The map is centered on Carleton College's location.
- Markers are placed for each building on campus, sourced from the `buildings.geojson` file.
- Users can interact with the map to explore different buildings and their locations.

## Technologies Used

- Leaflet.js for mapping
- HTML, CSS, and JavaScript for web development
- GeoJSON for building data representation

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.