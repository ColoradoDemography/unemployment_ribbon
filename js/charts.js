//Jobs by Sector main functions
//UTILITY FUNCTIONS
	
//Join function from http://learnjsdata.com/combine_data.html

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};
function MonIdx(inMonth){
	var outMonth = 0;
	switch(inMonth) {
		case "January" : outMonth = 1; break;
		case "February" : outMonth = 2; break;
		case "March" : outMonth = 3; break;
		case "April" : outMonth = 4; break;
		case "May" : outMonth = 5; break;
		case "June" : outMonth = 6; break;
		case "July" : outMonth = 7; break;
		case "August" : outMonth = 8; break;
		case "September" : outMonth = 9; break;
		case "October" : outMonth = 10; break;
		case "November" : outMonth = 11; break;
		case "December" : outMonth = 12; break;
	};
   return outMonth;
};


//captionTxt specifies the chart caption

function captionTxt(posY) {

	//Date Format
   var formatDate = d3.timeFormat("%m/%d/%Y");
   var dateStr = "Visualization by the State Demography Office, Print Date: "+ formatDate(new Date);
   var capTxt = [
                  {"captxt" : "Data: Bureau of Labor Statistics API - Data not Seasonally Adjusted", "ypos" : posY},
		          {"captxt" : "BLS.gov cannot vouch for the data or analyses derived from these data after the data have been retrieved from BLS.gov.",  "ypos" : posY + 10},    //Update this line as the production date changes
				  {"captxt" : dateStr,  "ypos" : posY + 20}
				 ];
return(capTxt);
};

//DATA MANIPULATION FUNCTIONS

//legendOut   appends the jobs table objects into the svg 
function legendOut(curYr, begYr, endYr){

var curtxt = "Unemployment Rate: " + curYr;
var prevtxt = "Unemployment Rate: " + (curYr - 1);
var midtxt = "Midpoint of Unemployment Rate, " + begYr + "-" + endYr;
var rngtxt = "Range of Unemployment Rate, " + begYr + "-" + endYr;

var outArr = [ {"color" : "red","text" : curtxt, "ypos" : 50},
			{"color" : 'brown',"text" : prevtxt, "ypos" : 60},
			{"color" : 'black', "text" : midtxt, "ypos" : 70},
			{"color" : 'blue', "text" : rngtxt, "ypos" : 80} ];

return outArr;
}; //end of legendOut

function switchFIPS(county){
   switch(county){
		case "Adams County":	
		fips = "001";	
		break;
		case "Alamosa County":	
		fips = "003";	
		break;
		case "Arapahoe County":	
		fips = "005";	
		break;
		case "Archuleta County":	
		fips = "007";	
		break;
		case "Baca County":	
		fips = "009";	
		break;
		case "Bent County":	
		fips = "011";	
		break;
		case "Boulder County":	
		fips = "013";	
		break;
		case "Broomfield County":	
		fips = "014";	
		break;
		case "Chaffee County":	
		fips = "015";	
		break;
		case "Cheyenne County":	
		fips = "017";	
		break;
		case "Clear Creek County":	
		fips = "019";	
		break;
		case "Conejos County":	
		fips = "021";	
		break;
		case "Costilla County":	
		fips = "023";	
		break;
		case "Crowley County":	
		fips = "025";	
		break;
		case "Custer County":	
		fips = "027";	
		break;
		case "Delta County":	
		fips = "029";	
		break;
		case "Denver County":	
		fips = "031";	
		break;
		case "Dolores County":	
		fips = "033";	
		break;
		case "Douglas County":	
		fips = "035";	
		break;
		case "Eagle County":	
		fips = "037";	
		break;
		case "Elbert County":	
		fips = "039";	
		break;
		case "El Paso County":	
		fips = "041";	
		break;
		case "Fremont County":	
		fips = "043";	
		break;
		case "Garfield County":	
		fips = "045";	
		break;
		case "Gilpin County":	
		fips = "047";	
		break;
		case "Grand County":	
		fips = "049";	
		break;
		case "Gunnison County":	
		fips = "051";	
		break;
		case "Hinsdale County":	
		fips = "053";	
		break;
		case "Huerfano County":	
		fips = "055";	
		break;
		case "Jackson County":	
		fips = "057";	
		break;
		case "Jefferson County":	
		fips = "059";	
		break;
		case "Kiowa County":	
		fips = "061";	
		break;
		case "Kit Carson County":	
		fips = "063";	
		break;
		case "Lake County":	
		fips = "065";	
		break;
		case "La Plata County":	
		fips = "067";	
		break;
		case "Larimer County":	
		fips = "069";	
		break;
		case "Las Animas County":	
		fips = "071";	
		break;
		case "Lincoln County":	
		fips = "073";	
		break;
		case "Logan County":	
		fips = "075";	
		break;
		case "Mesa County":	
		fips = "077";	
		break;
		case "Mineral County":	
		fips = "079";	
		break;
		case "Moffat County":	
		fips = "081";	
		break;
		case "Montezuma County":	
		fips = "083";	
		break;
		case "Montrose County":	
		fips = "085";	
		break;
		case "Morgan County":	
		fips = "087";	
		break;
		case "Otero County":	
		fips = "089";	
		break;
		case "Ouray County":	
		fips = "091";	
		break;
		case "Park County":	
		fips = "093";	
		break;
		case "Phillips County":	
		fips = "095";	
		break;
		case "Pitkin County":	
		fips = "097";	
		break;
		case "Prowers County":	
		fips = "099";	
		break;
		case "Pueblo County":	
		fips = "101";	
		break;
		case "Rio Blanco County":	
		fips = "103";	
		break;
		case "Rio Grande County":	
		fips = "105";	
		break;
		case "Routt County":	
		fips = "107";	
		break;
		case "Saguache County":	
		fips = "109";	
		break;
		case "San Juan County":	
		fips = "111";	
		break;
		case "San Miguel County":	
		fips = "113";	
		break;
		case "Sedgwick County":	
		fips = "115";	
		break;
		case "Summit County":	
		fips = "117";	
		break;
		case "Teller County":	
		fips = "119";	
		break;
		case "Washington County":	
		fips = "121";	
		break;
		case "Weld County":	
		fips = "123";	
		break;
		case "Yuma County":	
		fips = "125";	
		break;
		case "Colorado":	
		fips = "000";	
		break;
}
return fips;
};

//buildData creates the basic data set
function buildData(jData, FIPS, TYPE){

var flatdata = [];
jData.forEach(function(cty) {
  cty.d.forEach(function(d1) {
    flatdata.push({
      fips : cty.s.substr(7,3),
      month : d1.k.substr(0,3),
	  year : +d1.k.substr(3,4),
      ui : +d1.v
    });
  });
});


var maxYr = d3.max(flatdata, function(d) { return +d.year;} );  //This is the maximum year, the currrent year
var prevYr = maxYr - 1;  //This is the previous year, current year - 1
 
var maxData = flatdata.filter(function(d) { //This is the data series for the current year
        if((d.fips == FIPS) && (d.year == maxYr) && (d.month != "Ann")) { return d;} 
    });

var prevData = flatdata.filter(function(d) { //This is the data series for the previous year
        if((d.fips == FIPS) && (d.year == prevYr) && (d.month != "Ann")) { return d;} 
    });


if(TYPE == "5Yr") {
  var statData = flatdata.filter(function(d) { 
        if((d.fips == FIPS) && (d.year >= (prevYr - 6)) && (d.year < prevYr) && (d.month != "Ann")) { return d;} 
    });
} else {
	 var statData = flatdata.filter(function(d) { 
        if((d.fips == FIPS) && (d.year >= 2009) && (d.year <= 2012) && (d.month != "Ann")) { return d;} 
    })
}

//Assembling the range data


var summaryMet = d3.rollup(statData, v => ({
   min_ui: d3.min(v, d => d.ui),
   max_ui: d3.max(v, d => d.ui),
   min_yr : d3.min(v, d => d.year),
   max_yr : d3.max(v, d => d.year)
		}),
		d => d.month); 

var summaryArr = Array.from(summaryMet);;

var summaryFlat = [];
summaryArr.forEach(function(d) {
	summaryFlat.push({
		fips : FIPS,
		month : d[0],
		min_ui : d[1].min_ui,
		max_ui : d[1].max_ui,
		min_yr : d[1].min_yr,
		max_yr : d[1].max_yr

	});
});

return([summaryFlat,maxData,prevData]);
} //End buildData


//CHART DATA FUNCTIONS

 
//DATA AND IMAGE DOWNLOAD FUNCTIONS
function dataDownload(indata){

	var seldCTY = d3.select('#selCty option:checked').text();
    var fileName = "Unemployment Data " + seldCTY + ".csv"
	//Percentage Format
   var formatPercent = d3.format(".1%")
//Prepping DATA
	
//Preparing Month Array
var month_arr = [{"monthN" : 1, "month" : "Jan", "monthName" : "January"},
                 {"monthN" : 2, "month" : "Feb", "monthName" : "February"},
				 {"monthN" : 3, "month" : "Mar", "monthName" : "March"},
				 {"monthN" : 4, "month" : "Apr", "monthName" : "April"},
				 {"monthN" : 5, "month" : "May", "monthName" : "May"},
				 {"monthN" : 6, "month" : "Jun", "monthName" : "June"},
				 {"monthN" : 7, "month" : "Jul", "monthName" : "July"},
				 {"monthN" : 8, "month" : "Aug", "monthName" : "August"},
				 {"monthN" : 9, "month" : "Sep", "monthName" : "September"},
				 {"monthN" : 10, "month" : "Oct", "monthName" : "October"},
				 {"monthN" : 11, "month" : "Nov", "monthName" : "November"},
				 {"monthN" : 12, "month" : "Dec", "monthName" : "December"}]

//Join and Sort datafiles

var ribbondata = join(indata[0], month_arr, "month", "month", function(dat,col){
		return{
			fips : col.fips,
			monthN : +dat.monthN,
			monthName : dat.monthName,
			min_ui : col.min_ui/100,
			mid_ui : (col.max_ui + col.min_ui)/200,
			max_ui : col.max_ui/100,
			min_yr : col.min_yr,
			max_yr : col.max_yr
		};
	}).sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });
	

var curdata = join(indata[1], month_arr, "month", "month", function(dat,col){
		return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			ui : (col !== undefined) ? col.ui/100 : null,
			year : (col !== undefined) ? col.year : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });
	  
var prevdata = join(indata[2], month_arr, "month", "month", function(dat,col){
		return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			ui : (col !== undefined) ? col.ui/100 : null,
			year : (col !== undefined) ? col.year : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });

var outData = join(ribbondata, prevdata, "monthN", "monthN", function(dat,col){
  return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			beginning_year : (col !== undefined) ? col.min_yr : null,
			ending_year : (col !== undefined) ? col.max_yr : null,
			minimum_ui :  (col !== undefined) ? formatPercent(col.min_ui) : null,
			mid_point_ui :  (col !== undefined) ? formatPercent(col.mid_ui) : null,
			maximum_ui :  (col !== undefined) ? formatPercent(col.max_ui) : null,
			previous_year : (col !== undefined) ? dat.year : null,
			previous_ui : (dat !== undefined) ? formatPercent(dat.ui) : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });
console.log(ribbondata);
console.log(prevdata);
console.log(outData);

var outData2 = join(outData, curdata, "monthN", "monthN", function(dat,col){
  return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			beginning_year : (col !== undefined) ? col.beginning_year : null,
			ending_year : (col !== undefined) ? col.ending_year : null,
			minimum_ui :  (col !== undefined) ? col.minimum_ui : null,
			mid_point_ui :  (col !== undefined) ? col.mid_point_ui : null,
			maximum_ui :  (col !== undefined) ? col.maximum_ui : null,
			previous_year : (col !== undefined) ? col.previous_year : null,
			previous_ui : (col !== undefined) ? col.previous_ui : null,
			current_year : (col !== undefined) ? dat.year : null,
			current_ui : (dat !== undefined) ? formatPercent(dat.ui) : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });

console.log(outData2);

    exportToCsv(fileName,outData2);
}; //end of dataDownload


function exportToCsv(filename, rows) {
        var csvFile = d3.csvFormat(rows);

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };


function imageDownload(outFileName) {
var svg_node = d3.select("svg").node();

saveSvgAsPng(svg_node, outFileName);

}; //End of imageDownload


//CHART FUNCTIONS
//initialChart reads information from the dropdowns
function initialChart(datain,CTY,TYPE) {  

genChart(datain[0],datain[1],datain[2],CTY,TYPE); //Generates the chart
 
}; // initialChart

//updateChart reads information from the dropdowns, updates the title block and generates the updated static chart
function updateChart(datain,CTY,TYPE) {

// Removes the chart

var graph = d3.select("svg").remove();

genChart(datain[0],datain[1], datain[2],CTY,TYPE); 
 
}; //updateChart

//genChart produces the ribbon chart
function genChart(ribbonData,curData,prevData,CTY,YEAR){ 

//Preparing Month Array
var month_arr = [{"monthN" : 1, "month" : "Jan", "monthName" : "January"},
                 {"monthN" : 2, "month" : "Feb", "monthName" : "February"},
				 {"monthN" : 3, "month" : "Mar", "monthName" : "March"},
				 {"monthN" : 4, "month" : "Apr", "monthName" : "April"},
				 {"monthN" : 5, "month" : "May", "monthName" : "May"},
				 {"monthN" : 6, "month" : "Jun", "monthName" : "June"},
				 {"monthN" : 7, "month" : "Jul", "monthName" : "July"},
				 {"monthN" : 8, "month" : "Aug", "monthName" : "August"},
				 {"monthN" : 9, "month" : "Sep", "monthName" : "September"},
				 {"monthN" : 10, "month" : "Oct", "monthName" : "October"},
				 {"monthN" : 11, "month" : "Nov", "monthName" : "November"},
				 {"monthN" : 12, "month" : "Dec", "monthName" : "December"}]

//Join and Sort datafiles

var ribbondata = join(ribbonData, month_arr, "month", "month", function(dat,col){
		return{
			fips : col.fips,
			monthN : +dat.monthN,
			monthName : dat.monthName,
			min_ui : col.min_ui/100,
			mid_ui : (col.max_ui + col.min_ui)/200,
			max_ui : col.max_ui/100,
			min_yr : col.min_yr,
			max_yr : col.max_yr
		};
	}).sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });
	

var curdata = join(curData, month_arr, "month", "month", function(dat,col){
		return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			ui : (col !== undefined) ? col.ui/100 : null,
			year : (col !== undefined) ? col.year : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });

var prevdata = join(prevData, month_arr, "month", "month", function(dat,col){
		return{
			fips : (col !== undefined) ? col.fips : null,
			monthN : (dat !== undefined) ? +dat.monthN : null,
			monthName : (dat !== undefined) ? dat.monthName : null,
			ui : (col !== undefined) ? col.ui/100 : null,
			year : (col !== undefined) ? col.year : null
		};
	}).filter(function(d) {return d.fips != null;})
	  .sort(function(a, b){ return d3.ascending(+a['monthN'], +b['monthN']); });
//Percentage Format
var formatPercent = d3.format(".1%")

//defining the SVG  
 margin = ({top: 20, right: 210, bottom: 40, left: 40})

    var width = 900,
	height = 600,
    barHeight = 8,
	barSpace = 4,
	axisShift = 130;
	
	
var maxCur = d3.max(curdata, function(d){return d.ui});
var maxRib = d3.max(ribbondata, function(d) {return d.max_ui});

var maxVal = (maxCur > maxRib) ? maxCur : maxRib;
var maxVal = maxVal + 0.02;


var xLabel = month_arr.map(d => d.monthName);

var config = ({
  domain: xLabel, 
  padding: 0.6, 
  round: true, 
  range: [40, Math.min(700, width - 40)] 
});


var yLen = 240;

var x_axis = d3.scalePoint()
  .domain(config.domain)
  .range(config.range)
  .padding(config.padding)
  .round(config.round);
 


var y_axis = d3.scaleLinear()
             .domain([maxVal,0])
	         .range([0,height - 350]);   //Controlling the length of the axis

//Define the lines

var Ribbon = d3.area()
        .x(function(d) { return x_axis(d.monthName) })
		.y0(function(d) { return y_axis(d.min_ui)-250 })
		.y1(function(d) { return y_axis(d.max_ui)-250 });
		

var MidLine = d3.line() 
        .x(function(d) { return x_axis(d.monthName) })
		.y(function(d) { return y_axis(d.mid_ui)-250 });
		
var CurLine = d3.line() 
       .x(function(d) { return x_axis(d.monthName) })
	   .y(function(d) { return y_axis(d.ui)-250 });
		

var PrevLine = d3.line() 
       .x(function(d) { return x_axis(d.monthName) })
	   .y(function(d) { return y_axis(d.ui)-250 });
		

//Output code for chart 

//Tooltip initialization 
var curtip = d3.tip()  //too;tip for current unemployment line
  .attr('class', 'd3-tip')  //This is the link to the CSS 
  .html(function(e,d) { 
    tipMsg = d.monthName + ", " + d.year + "<br> Unemployment Rate: " + formatPercent(d.ui);
    return tipMsg;
 }); //This is the tip content

var prevtip = d3.tip()  //too;tip for current unemployment line
  .attr('class', 'd3-tip')  //This is the link to the CSS 
  .html(function(e,d) { 
    tipMsg = d.monthName + ", " + d.year + "<br> Unemployment Rate: " + formatPercent(d.ui);
    return tipMsg;
 }); //This is the tip content

var mintip = d3.tip()  //too;tip for minimum unemployment value of ribbon
  .attr('class', 'd3-tip')  //This is the link to the CSS 
  .html(function(e,d) { 
    tipMsg = d.monthName + ", " + d.min_yr + "-" + d.max_yr + "<br> Minimum Unemployment Rate: " + formatPercent(d.min_ui);
    return tipMsg;
 }); //This is the tip content

var midtip = d3.tip()  //too;tip for middle unemployment value of ribbon
  .attr('class', 'd3-tip')  //This is the link to the CSS 
  .html(function(e,d) { 
    tipMsg = d.monthName + ", " + d.min_yr + "-" + d.max_yr + "<br> Mid-point Unemployment Rate: " + formatPercent(d.mid_ui);
    return tipMsg;
 }); //This is the tip content

var maxtip = d3.tip()  //too;tip for maximum unemployment value of ribbon
  .attr('class', 'd3-tip')  //This is the link to the CSS 
  .html(function(e,d) { 
    tipMsg = d.monthName + ", " + d.min_yr + "-" + d.max_yr + "<br> Maximum Unemployment Rate: " + formatPercent(d.max_ui);
    return tipMsg;
 }); //This is the tip content

     
  var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [0, 0, width, height])
		 .call(curtip)  //Add Tooltips to Visualuzation
		 .call(prevtip)
         .call(mintip)
         .call(midtip)
         .call(maxtip);


//Title
var titStr = "Unemployment Rate: " + CTY;
graph.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16px sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);


   // Add the Ribbon
 graph.append("path")
     .data([ribbondata])
	  .attr("class","ribbon")
      .style("fill", "#46F7F6")
      .style("stroke", "steelblue")
      .style("stroke-width", 1.5)
	  .style("fill-opacity",0.2)
	  .attr("transform", `translate(${margin.left + axisShift - 40},300)`)
      .attr("d", Ribbon);
	  

// Add the  Midline
graph.append("path")
      .data([ribbondata])
	  .attr("class","midline")
      .style("stroke", "black")
	  .style("fill","none")
      .style("stroke-width", 1.5)
	  .attr("transform", `translate(${margin.left + axisShift - 40},300)`)
      .attr("d", MidLine);
		

// Add the CurLine
graph.append("path")
      .datum(curdata)
	  .attr("class","curline")
      .style("stroke", "red")
	  .style("fill","none")
      .style("stroke-width", 1.5)
	  .attr("transform", `translate(${margin.left + axisShift - 40},300)`)
      .attr("d", CurLine);
	  

// Add the PrevLine
graph.append("path")
      .datum(prevdata)
	  .attr("class","prevline")
      .style("stroke", "brown")
	  .style("fill","none")
      .style("stroke-width", 1.5)
	  .attr("transform", `translate(${margin.left + axisShift - 40},300)`)
      .attr("d", PrevLine);
	  

//Add the circles to the ribbon
graph.selectAll("MaxCircles")
      .data(ribbondata)
      .enter()
      .append("circle")
        .attr("fill", "steelblue")
        .attr("stroke", "none")
		.attr("transform", `translate(${margin.left + axisShift - 40},300)`)
        .attr("cx", function(d) { return x_axis(d.monthName) })
        .attr("cy", function(d) { return y_axis(d.max_ui)-250 })
        .attr("r", 3)
		.on('mouseover', function(e,d) { maxtip.show(e,d); })  //the content of the tip is established in the initialization
        .on('mouseout', maxtip.hide);
				
graph.selectAll("MinCircles")
        .data(ribbondata)
        .enter()
		.append("circle")
        .attr("fill", "steelblue")
        .attr("stroke", "none")
		.attr("transform", `translate(${margin.left + axisShift - 40},300)`)
        .attr("cx", function(d) { return x_axis(d.monthName) })
        .attr("cy", function(d) { return y_axis(d.min_ui)-250 })
        .attr("r", 3)
		.on('mouseover', function(e,d) { mintip.show(e,d); })  //the content of the tip is established in the initialization
        .on('mouseout', mintip.hide);;
		
graph.selectAll("MidCircles")
         .data(ribbondata)
         .enter()
		 .append("circle")
        .attr("fill", "black")
        .attr("stroke", "none")
		.attr("transform", `translate(${margin.left + axisShift - 40},300)`)
        .attr("cx", function(d) { return x_axis(d.monthName) })
        .attr("cy", function(d) { return y_axis(d.mid_ui)-250 })
        .attr("r", 3)
		.on('mouseover', function(e,d) { midtip.show(e,d); })  //the content of the tip is established in the initialization
        .on('mouseout', midtip.hide);
		


graph.selectAll("CurCircles")
         .data(curdata)
         .enter()
		 .append("circle")
        .attr("fill", "red")
        .attr("stroke", "none")
		.attr("transform", `translate(${margin.left + axisShift - 40},300)`)
        .attr("cx", function(d) { return x_axis(d.monthName) })
        .attr("cy", function(d) { return y_axis(d.ui)-250 })
        .attr("r", 3)
		.on('mouseover', function(e,d) { curtip.show(e,d); })  //the content of the tip is established in the initialization
        .on('mouseout', curtip.hide);

graph.selectAll("PrevCircles")
         .data(prevdata)
         .enter()
		 .append("circle")
        .attr("fill", "brown")
        .attr("stroke", "none")
		.attr("transform", `translate(${margin.left + axisShift - 40},300)`)
        .attr("cx", function(d) { return x_axis(d.monthName) })
        .attr("cy", function(d) { return y_axis(d.ui)-250 })
        .attr("r", 3)
		.on('mouseover', function(e,d) { prevtip.show(e,d); })  //the content of the tip is established in the initialization
        .on('mouseout', prevtip.hide);

//X- axis
graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${margin.left + axisShift - 40},300)`)
      .call(d3.axisBottom(x_axis));

//Y-axis
graph.append("g")
      .attr("class","Y-Axis")
      .attr("transform", `translate(${margin.left + axisShift},50)`)   //Controls the location of the axis
      .call(d3.axisLeft(y_axis).tickFormat(formatPercent));
	  


//caption 
var captionStr = captionTxt(yLen + 100);
var caption =  graph.append("g")
	     .attr("class","tabobj");
		 
caption.selectAll("text")
        .data(captionStr)
		.enter()
        .append("text")
        .text(function(d) {return d.captxt})
	    .attr("x", 165)             
        .attr("y", function(d) {return d.ypos})
        .attr("text-anchor", "right")  
        .style("font", "9px sans-serif");

//legend
//Gathering Year Values

var curYear = d3.max(curdata, function(d) {return d.year});
var begYear = d3.max(ribbondata, function(d) {return d.min_yr});
var endYear = d3.max(ribbondata, function(d) {return d.max_yr});
var tabArray = legendOut(curYear,begYear,endYear);

var barHeight = 4;

var rectanchorX = 600;

var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  barHeight)
    .attr("height", barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 10;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9px sans-serif");
	
return graph.node();
 
};  //end of genChart

