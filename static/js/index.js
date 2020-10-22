const serverBaseURL = "http://127.0.0.1:5000"
const apiBaseURL = `${serverBaseURL}/api`
const apiCurrentVersion = "v1.0"

let state = {
  "pieCharts" : [],
  "map" : {},
  "year" : "",
  "caseMarkers" : {}
}

const elements =  {
  divLoading : d3.select(".loading"),
  divMap : d3.select("#mapid"),
  divPieChartRace : d3.select(".chart--race"),
  divChartBar : d3.select(".chart--bar"),
  selectYear : d3.select("#selectYear"),
  buttonApplySettings : d3.select("#buttonApplySettings"),
  divChartRowList : d3.selectAll(".row__charts")
}

/**
 * Sets a sleep timer.
 * From: https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout
 * @param {int} m Time in millseconds
 */
const sleep = m => new Promise(r => setTimeout(r, m))

async function main(){
  await showLoading();
  bindHandlers();

  try{
    state.map = makeMap();

    const streetLayer = makeStreetTileLayer();
    streetLayer.addTo(state.map);

    const availableYears = await loadAvailableYears();
    populateSelectYears(availableYears);
  }
  finally {
    hideLoading();
  }
}

main();


function bindHandlers(){
  elements.buttonApplySettings.on("click", onApplySettings);
}

async function onApplySettings(){
  await showLoading();
  hideChartRows();
  clearData();

  try{
    const selectElement = elements.selectYear;
    const selectedOption = selectElement.property("value");
    console.log(selectedOption);

    if(selectedOption != "None"){
      const selectedYear = selectedOption;
      await updateCasesByYear(selectedYear);
      state.year = selectedYear;
      showChartRows();
    }
  }
  finally {
    hideLoading();
  }
}

function clearData(){
  state.year = "";
  clearCharts();
  state.map.removeLayer(state.caseMarkers);
}

function clearCharts(){
  let pieCharts = state.pieCharts;
  pieCharts.forEach(chart => chart.dispose());
  state.pieCharts = [];
}

function populateSelectYears(options){
  const selectElement = elements.selectYear;
  options.forEach(
    option => {
      const optionElement = selectElement.append("option");
      optionElement.text(option);
    }
  );
}

async function updateCasesByYear(year){

  const allCasesByYear = await loadCasesByYear(year);
  console.log(allCasesByYear);

  const caseMarkers = createCaseClustersMarkers(allCasesByYear);
  caseMarkers.addTo(state.map);
  state.caseMarkers = caseMarkers;

  am4core.ready(() => generateAmCharts(allCasesByYear, year));
}

function hideLoading(){
  const loadingElement = elements.divLoading;
  loadingElement.classed("loading--active", false);
  loadingElement.classed("loading--inactive", true);
}

async function showLoading(){
  const loadingElement = elements.divLoading;
  loadingElement.classed("loading--active", true);
  loadingElement.classed("loading--inactive", false);
  await sleep(300);
}

function hideChartRows(){
  const chartRowElements = elements.divChartRowList;
  chartRowElements.classed("row__charts--inactive", true);
  chartRowElements.classed("row__charts--active", false);
}

function showChartRows(){
  const chartRowElements = elements.divChartRowList;
  chartRowElements.classed("row__charts--inactive", false);
  chartRowElements.classed("row__charts--active", true);
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

async function loadAvailableYears(){
  const url = `${apiBaseURL}/${apiCurrentVersion}/year`;
  const response = await d3.json(url);
  return response.availableYears;
}

function generateAmCharts(cases){
  am4core.useTheme(am4themes_animated);
  let racePieChart = generateRacePieChart(cases);
  state.pieCharts.push(racePieChart);
}

function generateRacePieChart(cases){
  const chartElement = elements.divPieChartRace;

  // Create chart instance
  var chart = am4core.create(chartElement.node(), am4charts.PieChart);
  //chart.responsive.enabled = true;

  chart.data = getRaceData(cases);
  chart.legend = new am4charts.Legend();
  chart.legend.position = "right";
  chart.legend.scrollable = true;

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

