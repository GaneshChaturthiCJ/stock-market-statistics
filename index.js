

var intervalType, key;
var i = 0;

function interday() {
  //console.log(document.getElementById("interdayId").value);
  intervalType = document.getElementById("interdayId").value;
}

function weekly() {
  //console.log(document.getElementById("weeklyId").value);
  intervalType = document.getElementById("weeklyId").value;
}

function monthly() {
  //console.log(document.getElementById("monthlyId").value);
  intervalType = document.getElementById("monthlyId").value;
}

function daily() {
  //console.log(document.getElementById("dailyId").value);
  intervalType = document.getElementById("dailyId").value;
}


function getKey() {
  key = document.getElementById("compId").value;
  if (key == "") {
    alert("KEY cannot be empty. Try searching 'IBM' or 'AMZN'!");
    return;
  }
  //console.log(key);
  setWatchist(key, intervalType);
}


function setWatchist(key, intervalType) {
  if (intervalType === undefined) {
    alert("Please select time interval [Intraday or Monthly...] ");
    return;
  }

  // Create and add a watchlist item of user choice

  const newDiv = document.createElement("div");
  const textnode = document.createTextNode(key + "<>");
  const textnode2 = document.createTextNode(intervalType + "<>");

  const textnode3 = document.createElement("button");
  textnode3.innerHTML = "REMOVE";

  newDiv.setAttribute("id", i);
  textnode3.setAttribute("id", i++);


  newDiv.appendChild(textnode);
  newDiv.appendChild(textnode2);
  newDiv.appendChild(textnode3).classList.add("btn");
  newDiv.classList.add("watchListEles");

  document.getElementById("DivLists").appendChild(newDiv).classList.add("watchListItems");



  //Remove watchlist items individually
  textnode3.addEventListener('click', function deleteDiv(e) {
    document.getElementById(e.target.id).style.display = "none";

  });

  //modify API URl based on the watchlist selected 
  newDiv.addEventListener("dblclick", function addModal(e) {
    //console.log(document.getElementById(e.target.id).textContent);
    var urlModifireStr = document.getElementById(e.target.id).textContent;
    var urlModifireArr = urlModifireStr.split("<>");
    //console.log(urlModifireArr);
    var api_url = `https://www.alphavantage.co/query?function=TIME_SERIES_${urlModifireArr[1]}&symbol=${urlModifireArr[0]}&interval=60min&outputsize=full&apikey=PZWD9KPHB5EKRDRN`;

    console.log(api_url);
    getapi(api_url, urlModifireArr);

  })

}

// fetch Statistical values of each Company

// Defining async function
async function getapi(url, urlModifireArr) {
  var timeSeries;

  if (urlModifireArr[1] === "MONTHLY") {
    timeSeries = "Monthly Time Series";
  } else if (urlModifireArr[1] === "WEEKLY") {
    timeSeries = "Weekly Time Series";
  } else if (urlModifireArr[1] === "INTRADAY") {
    timeSeries = "Time Series (60min)";
  } else if (urlModifireArr[1] === "DAILY") {
    timeSeries = "";
  }


  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();

  var arrStats = [];
  var arrKeys = [];


  Object.values(data[timeSeries]).forEach(val => arrStats.push(val));
  //console.log(a);

  Object.entries(data[timeSeries]).forEach(([key, value]) => {
    arrKeys.push((`${key}`))
  });


  //Appending values to the table
  let tab =
    `<tr>
  <th scope="col">TIME FRAME</th>
    <th>OPEN</th>
    <th>HIGH</th>
    <th>LOW</th>
    <th>CLOSE</th>
    <th>VOLUME</th>
  </tr>`;


  for (var i = 0; i < arrStats.length; i++) {
    tab += `<tr>

  <td style="font-weight:bold;">${arrKeys[i]}</td>	    
  <td style="font-weight:bold;">${arrStats[i]["1. open"]} </td>
  <td style="font-weight:bold;">${arrStats[i]["2. high"]}</td>
  <td style="font-weight:bold;">${arrStats[i]["3. low"]}</td>
  <td style="font-weight:bold;">${arrStats[i]["4. close"]}</td>
  <td style="font-weight:bold;">${arrStats[i]["5. volume"]}</td>	
  </tr>`;
  }

  document.getElementById("modalValues").innerHTML = tab;

}
