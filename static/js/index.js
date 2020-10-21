const serverBaseURL = "http://127.0.0.1:5000"
const apiBaseURL = `${serverBaseURL}/api`
const apiCurrentVersion = "v1.0"
const defaultYear = 2020;

const elements =  {
  divLoading : d3.select(".loading"),
  divMap : d3.select("#mapid")
}

async function main(){
  const map = makeMap();

  const streetLayer = makeStreetTileLayer();
  streetLayer.addTo(map);

  await updateCasesByYear(defaultYear, map);
}

main();

async function updateCasesByYear(year, map){
  showLoading();

  const allCasesByYear = await loadCasesByYear(year);
  console.log(allCasesByYear);

  const caseMarkers = createCaseClustersMarkers(allCasesByYear);
  caseMarkers.addTo(map);

  am4core.ready(() => generateAmCharts(allCasesByYear, year));

  hideLoading();
}

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

function generateAmCharts(cases, year){
  am4core.useTheme(am4themes_animated);
  generateRacePieChart(cases, year);
}

function generateRacePieChart(cases, year){
  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.PieChart);
  // chart.responsive.enabled = true;

  chart.data = getRaceData(cases);
  chart.legend = new am4charts.Legend();
  chart.legend.position = "right";
  chart.legend.scrollable = true;

  // Add label
  chart.innerRadius = 100;
  var label = chart.seriesContainer.createChild(am4core.Label);
  label.text = year;
  label.horizontalCenter = "middle";
  label.verticalCenter = "middle";
  label.fontSize = 50;

  // Add and configure Series
  var pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "count";
  pieSeries.dataFields.category = "race";
  pieSeries.labels.template.disabled = true;
  pieSeries.ticks.template.disabled = true;

  return chart;
}

function getRaceData(cases){
  let raceCount = {};
  for (let caseInfo of cases){
    const caseData = caseInfo["case"];

    const force = caseData["force"];
    if(!force) break;

    const subject = force["subject"];
    if(!subject) break;

    race = subject["race"];
    if(race){
      if(raceCount[race] > 0){
        raceCount[race]++;
      }
      else{
        raceCount[race] = 1;
      }
    }
  }

  let raceStats = [];
  Object.entries(raceCount).forEach(
    ([race, count]) => {
      raceStats.push({
        "race" : race,
        "count" : count
      });
    }
  );
  return raceStats;
}

