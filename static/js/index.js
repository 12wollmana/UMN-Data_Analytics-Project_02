const serverBaseURL = "http://127.0.0.1:5000"
const apiBaseURL = `${serverBaseURL}/api`
const apiCurrentVersion = "v1.0"
const defaultYear = 2020;

const elements =  {
  divLoading : d3.select(".loading"),
  divMap : d3.select("#mapid")
}

async function main(){
  showLoading();

  const map = makeMap();

  const streetLayer = makeStreetTileLayer();
  streetLayer.addTo(map);

  const allCasesByYear = await loadCasesByYear(defaultYear);
  console.log(allCasesByYear);

  const caseMarkers = createCaseClustersMarkers(allCasesByYear);
  caseMarkers.addTo(map);

  hideLoading();
}

main();

function hideLoading(){
  const loadingElement = elements.divLoading;
  loadingElement.classed("loading--active", false);
  loadingElement.classed("loading--inactive", true);
}

function showLoading(){
  const loadingElement = elements.divLoading;
  loadingElement.classed("loading--active", true);
  loadingElement.classed("loading--inactive", false);
}

function makeMap(){
  const mapContainer = elements.divMap;
  // Creating Leaflet map object with maker clusters
  var myMap = L.map(mapContainer.node(), {
    center: [44.9778, -93.2650],
    zoom: 13
  });

  return myMap;
}

function makeStreetTileLayer(){
  // Adding tile layer
  const streetsLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
    {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
   }
  );

  return streetsLayer;
}

function createCaseClustersMarkers(cases){
  var markers = L.markerClusterGroup();

  cases.forEach(caseInfo => {
    const currentCase = caseInfo.case;

    const longitude = currentCase.longitude;
    const latitude = currentCase.latitude;
    const date = currentCase.date;
    const problem = currentCase.problem;

    if(longitude && latitude){
      const marker = L.marker([latitude, longitude]);
      marker.bindPopup(
        `
        <h3>
        ${problem}
        </h3>
        <hr>
        ${date}
        `
      );
      markers.addLayer(marker);
    }
  });

  return markers;
}

async function loadCasesByYear(year){
  const url = `${apiBaseURL}/${apiCurrentVersion}/year/${year}`;
  const allCases = await d3.json(url);
  return allCases;
}

// PIE CHARTS

// Race Pie chart
am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

/**
 * Define data for each year
 */
var chartData = {
  "2008": [
    { "sector": "Agriculture", "size": 6.6 },
    { "sector": "Mining and Quarrying", "size": 0.6 },
    { "sector": "Manufacturing", "size": 23.2 },
    { "sector": "Electricity and Water", "size": 2.2 },
    { "sector": "Construction", "size": 4.5 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 14.6 },
    { "sector": "Transport and Communication", "size": 9.3 },
    { "sector": "Finance, real estate and business services", "size": 22.5 } ],
  "2009": [
    { "sector": "Agriculture", "size": 6.4 },
    { "sector": "Mining and Quarrying", "size": 0.5 },
    { "sector": "Manufacturing", "size": 22.4 },
    { "sector": "Electricity and Water", "size": 2 },
    { "sector": "Construction", "size": 4.2 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 14.8 },
    { "sector": "Transport and Communication", "size": 9.7 },
    { "sector": "Finance, real estate and business services", "size": 22 } ],
  "2010": [
    { "sector": "Agriculture", "size": 6.1 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 20.9 },
    { "sector": "Electricity and Water", "size": 1.8 },
    { "sector": "Construction", "size": 4.2 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 13.7 },
    { "sector": "Transport and Communication", "size": 9.4 },
    { "sector": "Finance, real estate and business services", "size": 22.1 } ],
  "2011": [
    { "sector": "Agriculture", "size": 6.2 },
    { "sector": "Mining and Quarrying", "size": 0.3 },
    { "sector": "Manufacturing", "size": 21.4 },
    { "sector": "Electricity and Water", "size": 1.9 },
    { "sector": "Construction", "size": 4.2 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 14.5 },
    { "sector": "Transport and Communication", "size": 10.6 },
    { "sector": "Finance, real estate and business services", "size": 23 } ],
  "2012": [
    { "sector": "Agriculture", "size": 5.7 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 20 },
    { "sector": "Electricity and Water", "size": 1.8 },
    { "sector": "Construction", "size": 4.4 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 15.2 },
    { "sector": "Transport and Communication", "size": 10.5 },
    { "sector": "Finance, real estate and business services", "size": 24.7 } ],
  "2013": [
    { "sector": "Agriculture", "size": 5.1 },
    { "sector": "Mining and Quarrying", "size": 0.3 },
    { "sector": "Manufacturing", "size": 20.4 },
    { "sector": "Electricity and Water", "size": 1.7 },
    { "sector": "Construction", "size": 4 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 16.3 },
    { "sector": "Transport and Communication", "size": 10.7 },
    { "sector": "Finance, real estate and business services", "size": 24.6 } ],
  "2014": [
    { "sector": "Agriculture", "size": 5.5 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 20.3 },
    { "sector": "Electricity and Water", "size": 1.6 },
    { "sector": "Construction", "size": 3.1 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 16.3 },
    { "sector": "Transport and Communication", "size": 10.7 },
    { "sector": "Finance, real estate and business services", "size": 25.8 } ],
  "2015": [
    { "sector": "Agriculture", "size": 5.7 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 20.5 },
    { "sector": "Electricity and Water", "size": 1.6 },
    { "sector": "Construction", "size": 3.6 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 16.1 },
    { "sector": "Transport and Communication", "size": 10.7 },
    { "sector": "Finance, real estate and business services", "size": 26 } ],
  "2016": [
    { "sector": "Agriculture", "size": 4.9 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 19.4 },
    { "sector": "Electricity and Water", "size": 1.5 },
    { "sector": "Construction", "size": 3.3 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 16.2 },
    { "sector": "Transport and Communication", "size": 11 },
    { "sector": "Finance, real estate and business services", "size": 27.5 } ],
  "2017": [
    { "sector": "Agriculture", "size": 4.7 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 18.4 },
    { "sector": "Electricity and Water", "size": 1.4 },
    { "sector": "Construction", "size": 3.3 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 16.9 },
    { "sector": "Transport and Communication", "size": 10.6 },
    { "sector": "Finance, real estate and business services", "size": 28.1 } ],
  "2018": [
    { "sector": "Agriculture", "size": 4.3 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 18.1 },
    { "sector": "Electricity and Water", "size": 1.4 },
    { "sector": "Construction", "size": 3.9 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 15.7 },
    { "sector": "Transport and Communication", "size": 10.6 },
    { "sector": "Finance, real estate and business services", "size": 29.1 } ],
  "2019": [
    { "sector": "Agriculture", "size": 4 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 16.5 },
    { "sector": "Electricity and Water", "size": 1.3 },
    { "sector": "Construction", "size": 3.7 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 14.2 },
    { "sector": "Transport and Communication", "size": 12.1 },
    { "sector": "Finance, real estate and business services", "size": 29.1 } ],
  "2020": [
    { "sector": "Agriculture", "size": 4.7 },
    { "sector": "Mining and Quarrying", "size": 0.2 },
    { "sector": "Manufacturing", "size": 16.2 },
    { "sector": "Electricity and Water", "size": 1.2 },
    { "sector": "Construction", "size": 4.1 },
    { "sector": "Trade (Wholesale, Retail, Motor)", "size": 15.6 },
    { "sector": "Transport and Communication", "size": 11.2 },
    { "sector": "Finance, real estate and business services", "size": 30.4 } ],
};

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.PieChart);

// Add data
chart.data = [
  { "sector": "Agriculture", "size": 6.6 },
  { "sector": "Mining and Quarrying", "size": 0.6 },
  { "sector": "Manufacturing", "size": 23.2 },
  { "sector": "Electricity and Water", "size": 2.2 },
  { "sector": "Construction", "size": 4.5 },
  { "sector": "Trade (Wholesale, Retail, Motor)", "size": 14.6 },
  { "sector": "Transport and Communication", "size": 9.3 },
  { "sector": "Finance, real estate and business services", "size": 22.5 }
];

// Add label
chart.innerRadius = 100;
var label = chart.seriesContainer.createChild(am4core.Label);
label.text = "2008";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fontSize = 50;

// Add and configure Series
var pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "size";
pieSeries.dataFields.category = "sector";

// Animate chart data
var currentYear = 2008;
function getCurrentData() {
  label.text = currentYear;
  var data = chartData[currentYear];
  currentYear++;
  if (currentYear > 2020)
    currentYear = 2008;
  return data;
}

function loop() {
  //chart.allLabels[0].text = currentYear;
  var data = getCurrentData();
  for(var i = 0; i < data.length; i++) {
    chart.data[i].size = data[i].size;
  }
  chart.invalidateRawData();
  chart.setTimeout( loop, 4000 );
}

loop();

}); // end am4core.ready()

