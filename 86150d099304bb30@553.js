function _1(md){return(
md`# Price action charts for popular stocks`
)}

function _2(md){return(
md`### Bollinger Band`
)}

function _N(Inputs){return(
Inputs.range([2, 100], {value: 20, step: 1, label: "Periods (N)"})
)}

function _K(Inputs){return(
Inputs.range([0, 10], {value: 2, step: 0.1, label: "Deviations (K)"})
)}

function _tickerInput(Inputs){return(
Inputs.radio(["Apple", "Google", "Tesla"], {label: "Radio buttons", value: "Apple"})
)}

function _6(renderBollingerChart){return(
renderBollingerChart()
)}

function _7(md){return(
md`### Creating facet chart for log returns`
)}

function _8(Plot,logReturns){return(
Plot.plot({
  color: { legend: true },
  marks: [
    Plot.line(logReturns, {
      x: "Date",
      y: "LogReturn",
      stroke: "Ticker",
      tip: true
    })
  ]
})
)}

function _9(md){return(
md`### Importing csv data`
)}

function _10(md){return(
md`### Apple OHLC data`
)}

function _data1(FileAttachment){return(
FileAttachment("aaplStock.csv").csv({typed: true})
)}

function _appleData(data1,dateParse,dateParser){return(
data1.map(d => ({...d, Date: dateParse(d.Date), Date1: dateParser(d.Date)}))
)}

function _13(__query,appleData,invalidation){return(
__query(appleData,{from:{table:"appleData"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"appleData")
)}

function _14(md){return(
md`### Google OHLC data`
)}

function _data2(FileAttachment){return(
FileAttachment("googStock.csv").csv({typed: true})
)}

function _googleData(data2,dateParse){return(
data2.map(d => ({...d, Date: dateParse(d.Date)}))
)}

function _17(__query,googleData,invalidation){return(
__query(googleData,{from:{table:"googleData"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"googleData")
)}

function _18(md){return(
md`### Tesla OHLC data`
)}

function _data3(FileAttachment){return(
FileAttachment("tslaStock.csv").csv({typed: true})
)}

function _teslaData(data3,dateParse){return(
data3.map(d => ({...d, Date: dateParse(d.Date)}))
)}

function _21(__query,teslaData,invalidation){return(
__query(teslaData,{from:{table:"teslaData"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"teslaData")
)}

function _22(md){return(
md`## Data Transformation`
)}

function _23(md){return(
md`### Calculate log returns for each stock`
)}

function _calculateLogReturns(){return(
function calculateLogReturns(data) {

  // Extract the 'Close' column from the data
  const closePrices = data.map(entry => entry.Close);
  
  // Calculate log returns
  const logReturns = closePrices.slice(1).map((price, index) => {
    const prevPrice = closePrices[index];
    return Math.log(price / prevPrice);
  });
  
  // Add the log returns to the original data
  const dataWithLogReturns = data.slice(1).map((entry, index) => ({
    ...entry,
    LogReturn: logReturns[index],
  }));
  
  // Display the updated data with log returns
  return dataWithLogReturns
    
}
)}

function _appleLogReturns(calculateLogReturns,appleData){return(
calculateLogReturns(appleData)
)}

function _googleLogReturns(calculateLogReturns,googleData){return(
calculateLogReturns(googleData)
)}

function _teslaLogReturns(calculateLogReturns,teslaData){return(
calculateLogReturns(teslaData)
)}

function _28(md){return(
md`### concat log returns for all stocks`
)}

function _dateParse(d3){return(
d3.timeParse("%m/%d/%y")
)}

function _dateParser(d3){return(
function dateParser(dateString) {

  // Assuming your date format is "MM/DD/YY"
const parseDate = d3.timeParse("%m/%d/%y");
const formatDate = d3.utcFormat("%Y-%m-%d");

// Parse the date string
const parsedDate = parseDate(dateString);

// Format the date as "YYYY-MM-DD"
const formattedDate = `${parsedDate.getUTCFullYear()}-${(parsedDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getUTCDate().toString().padStart(2, '0')}`;

console.log(formattedDate); // This will output the formatted date string

  return parseDate
  
}
)}

function _logReturns(appleLogReturns,googleLogReturns,teslaLogReturns){return(
appleLogReturns.map(d => ({Date: d.Date, LogReturn: d.LogReturn, Ticker: "AAPL"})).concat(
              googleLogReturns.map(d => ({Date: d.Date, LogReturn: d.LogReturn, Ticker: "GOOGL"})),
              teslaLogReturns.map(d => ({Date: d.Date, LogReturn: d.LogReturn, Ticker: "TSLA"}))
)
)}

function _32(__query,logReturns,invalidation){return(
__query(logReturns,{from:{table:"logReturns"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"logReturns")
)}

function _33(md){return(
md`### Bollinger band`
)}

function _bollinger(){return(
function bollinger(values, N, K) {
  let i = 0;
  let sum = 0;
  let sum2 = 0;
  const bands = K.map(() => new Float64Array(values.length).fill(NaN));
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    const value = values[i];
    sum += value, sum2 += value ** 2;
  }
  for (let n = values.length, m = bands.length; i < n; ++i) {
    const value = values[i];
    sum += value, sum2 += value ** 2;
    const mean = sum / N;
    const deviation = Math.sqrt((sum2 - sum ** 2 / N) / (N - 1));
    for (let j = 0; j < K.length; ++j) {
      bands[j][i] = mean + deviation * K[j];
    }
    const value0 = values[i - N + 1];
    sum -= value0, sum2 -= value0 ** 2;
  }
  return bands;
}
)}

function _35(md){return(
md`### Create function for bollinger band charts
`
)}

function _bollingerChart(d3,bollinger,N,K){return(
function bollingerChart(data, ticker) {
  
  const width = 928;
  const height = 600;
  const marginTop = 10;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const values = Float64Array.from(data, d => d.Close);
  
  const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .rangeRound([marginLeft, width - marginRight]);

  const y = d3.scaleLog()
      .domain(d3.extent(values))
      .rangeRound([height - marginBottom - 20, marginTop]);

  const line = d3.line()
      .defined((y, i) => !isNaN(data[i].Date) && !isNaN(y))
      .x((d, i) => x(data[i].Date))
      .y(y);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call(g => g.select(".domain").remove());

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickValues(d3.ticks(...y.domain(), 10)).tickFormat(d => d))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("${ticker}: ↑ Daily close ($)"));

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
    .selectAll()
    .data([values, ...bollinger(values, N, [-K, 0, +K])])
    .join("path")
      .attr("stroke", (d, i) => ["#aaa", "green", "blue", "red"][i])
      .attr("d", line);
  
  return svg.node();  
}
)}

function _renderBollingerChart(tickerInput,bollingerChart,appleData,googleData,teslaData){return(
function renderBollingerChart() {
  if (tickerInput=='Apple'){
    return bollingerChart(appleData, tickerInput);
  } else if (tickerInput=='Google'){
    return bollingerChart(googleData, tickerInput);
  } else if (tickerInput=='Tesla'){
    return bollingerChart(teslaData, tickerInput);
}
}
)}

function _38(md){return(
md`### Function to create candlestick charts`
)}

function _39(candleStickChart,appleData){return(
candleStickChart(appleData.slice(-100))
)}

function _candleStickChart(calculateSMA,Plot,tooltip){return(
function candleStickChart(ticker) {

  // Declare the chart dimensions and margins.
  const width = 1200;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const smaWindow = 10; // You can adjust the window size as needed
  const smaValues = calculateSMA(ticker, "Close", smaWindow);
  
  // Create the plot
  return Plot.plot({
    inset: 6,
    width: width,
    height: height,
    marginTop: marginTop,
    marginRight: marginRight,
    marginBottom: marginBottom,
    marginLeft: marginLeft,
    grid: true,
    y: { label: "↑ Apple stock price ($)" },
    color: { domain: [-1, 0, 1], range: ["#e41a1c", "#000000", "#4daf4a"] },
    marks: [
      Plot.ruleX(ticker, {
        x: "Date",
        y1: "Low",
        y2: "High",
      }),
      Plot.ruleX(ticker, {
        x: "Date",
        y1: "Open",
        y2: "Close",
        stroke: (d) => Math.sign(d.Close - d.Open),
        strokeWidth: 4,
        strokeLinecap: "round",
        title: (d, i) => tooltip(d, i, smaValues, smaWindow), // Use the tooltip function
      }),
      Plot.line(ticker, {
        x: "Date",
        y: (d, i) => smaValues[i],
        stroke: "blue",
        strokeWidth: 2
      })
    ],
  });
}
)}

function _calculateSMA(){return(
function calculateSMA(data, key, windowSize) {
  // Calculate Simple Moving Average
  return data.map((d, i, arr) => {
    const startIdx = Math.max(0, i - windowSize + 1);
    const sum = arr.slice(startIdx, i + 1).reduce((acc, val) => acc + val[key], 0);
    return sum / Math.min(i + 1, windowSize);
  });
}
)}

function _tooltip(){return(
(d, i, smaValues, smaWindow) => `
  Date: ${d.Date}\nOpen: ${d.Open}\nClose: ${d.Close}\nLow: ${d.Low}\nHigh: ${d.High}\nSMA${smaWindow}: ${smaValues[i].toFixed(2)}
`
)}

function _43(md){return(
md`### Reference
Bollinger charts - > https://observablehq.com/@d3/bollinger-bands/2?intent=fork

Candlestick charts - > https://observablehq.com/@d3/candlestick-chart/2`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["tslaStock.csv", {url: new URL("./files/7f680522a3e5b934ed914e49331f0e4b92e3b5cdb73842ef6a978593dea26dacda9a3a145609076bbbcc99eed89a3a852828c3b85b55326bd9e39932d93e64df.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["googStock.csv", {url: new URL("./files/5f12706b7f060df1c33819deef453fb724ccb95fadef85ca2b5f9257617e2201e511b583416175bf1bc9854454b4839e96db946cb853a54d56d23a5ccc19d2f0.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["aaplStock.csv", {url: new URL("./files/9786511a2b1e02704eecec9f8517b0c81d6543036d0fb2b5b7e429890ae0d1a5861ab1077e35de98c1de3b398c3dbd8be6b39742ba382102c07c74a068fca7be.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof N")).define("viewof N", ["Inputs"], _N);
  main.variable(observer("N")).define("N", ["Generators", "viewof N"], (G, _) => G.input(_));
  main.variable(observer("viewof K")).define("viewof K", ["Inputs"], _K);
  main.variable(observer("K")).define("K", ["Generators", "viewof K"], (G, _) => G.input(_));
  main.variable(observer("viewof tickerInput")).define("viewof tickerInput", ["Inputs"], _tickerInput);
  main.variable(observer("tickerInput")).define("tickerInput", ["Generators", "viewof tickerInput"], (G, _) => G.input(_));
  main.variable(observer()).define(["renderBollingerChart"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["Plot","logReturns"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("data1")).define("data1", ["FileAttachment"], _data1);
  main.variable(observer("appleData")).define("appleData", ["data1","dateParse","dateParser"], _appleData);
  main.variable(observer()).define(["__query","appleData","invalidation"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("data2")).define("data2", ["FileAttachment"], _data2);
  main.variable(observer("googleData")).define("googleData", ["data2","dateParse"], _googleData);
  main.variable(observer()).define(["__query","googleData","invalidation"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("data3")).define("data3", ["FileAttachment"], _data3);
  main.variable(observer("teslaData")).define("teslaData", ["data3","dateParse"], _teslaData);
  main.variable(observer()).define(["__query","teslaData","invalidation"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("calculateLogReturns")).define("calculateLogReturns", _calculateLogReturns);
  main.variable(observer("appleLogReturns")).define("appleLogReturns", ["calculateLogReturns","appleData"], _appleLogReturns);
  main.variable(observer("googleLogReturns")).define("googleLogReturns", ["calculateLogReturns","googleData"], _googleLogReturns);
  main.variable(observer("teslaLogReturns")).define("teslaLogReturns", ["calculateLogReturns","teslaData"], _teslaLogReturns);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("dateParse")).define("dateParse", ["d3"], _dateParse);
  main.variable(observer("dateParser")).define("dateParser", ["d3"], _dateParser);
  main.variable(observer("logReturns")).define("logReturns", ["appleLogReturns","googleLogReturns","teslaLogReturns"], _logReturns);
  main.variable(observer()).define(["__query","logReturns","invalidation"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("bollinger")).define("bollinger", _bollinger);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("bollingerChart")).define("bollingerChart", ["d3","bollinger","N","K"], _bollingerChart);
  main.variable(observer("renderBollingerChart")).define("renderBollingerChart", ["tickerInput","bollingerChart","appleData","googleData","teslaData"], _renderBollingerChart);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer()).define(["candleStickChart","appleData"], _39);
  main.variable(observer("candleStickChart")).define("candleStickChart", ["calculateSMA","Plot","tooltip"], _candleStickChart);
  main.variable(observer("calculateSMA")).define("calculateSMA", _calculateSMA);
  main.variable(observer("tooltip")).define("tooltip", _tooltip);
  main.variable(observer()).define(["md"], _43);
  return main;
}
