// When the user scrolls the page, execute myFunction
//Double check tipping revenue, electricity savings, RECs compared with current URAAD
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("header");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// SIDEBAR

/* Set the width of the side navigation to 250px */
function openNav() {
	document.getElementById("about-side-nav").style.width = "100%";
}
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
	document.getElementById("about-side-nav").style.width = "0";
}



var naturalGasEVal = 0.6;
var EPrice = 0.15;
var creditVal = 33.00;
var OMCosts = 1855000.0;
var tax = 230000

var tipFee1 = 42.0;
var tipFee2 = 60.0;
var tipTransition = 10;

var salvagePercent = 0.11;
var depreciationYrs = 12;

var numWorkers = 5;
var workCost = 60000.0;
var workingCapital = 3000000.0;
var discountRate = 0.07;

var feedCombo = "cowManure";
var feedComp = 100;
var feedVol = 19700;

var opDays = 365;
var reactorVol = (feedVol/.1)*21; //Reactor volume in L
var totalCC = (3000*(reactorVol/3.785/90)**0.53)*(777/320)*(1*1.58+2.5); //Convert to gallons GET RID OF CAPITAL COST INPUT

var yearTable = Array(17).fill(0);
var PVTable = Array(17).fill(0);

var sensArray = [[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1]];

// Calculator Value Update Function
function updateVal() {
	opDays = parseFloat(document.getElementById("opDays").value);
	// WBTonPerYr = parseFloat(document.getElementById("WBTonPerYr").value);
	// SSOTonPerYr = parseFloat(document.getElementById("SSOTonPerYr").value);
	//totalCC = parseFloat(document.getElementById("totalCC").value);

	naturalGasEVal = parseFloat(document.getElementById("naturalGasEVal").value);
	EPrice = parseFloat(document.getElementById("EPrice").value);
	creditVal = parseFloat(document.getElementById("creditVal").value);
	OMCosts = parseFloat(document.getElementById("OMCosts").value);
	tax = parseFloat(document.getElementById("tax").value);

	tipFee1 = parseFloat(document.getElementById("tipFee1").value);
	tipFee2 = parseFloat(document.getElementById("tipFee2").value);
	tipTransition = parseFloat(document.getElementById("tipTransition").value);

	salvagePercent = parseFloat(document.getElementById("salvagePercent").value);
	depreciationYrs = parseFloat(document.getElementById("depreciationYrs").value);

	numWorkers = parseFloat(document.getElementById("numWorkers").value);
	workCost = parseFloat(document.getElementById("workCost").value);
	workingCapital = parseFloat(document.getElementById("workingCapital").value);
	discountRate = parseFloat(document.getElementById("discountRate").value);

	feedCombo = document.getElementById("feedCombo").value;
	feedComp = parseFloat(document.getElementById("feedComp").value);
	feedVol = parseFloat(document.getElementById("feedVol").value);
}

// Calculator Main Function
function calc() {
	// Update values from form
	updateVal();
	// (0) Calculate Biogas output feedComp is reversed!!! Right now it's in terms of feedstock 1 when I want it to be other way around
	if (feedCombo == "cowManure"){
		var bioOut = 0.0288*feedVol/.1;
	}
	else if (feedCombo == "pigManure"){
		var bioOut = 0.02215*feedVol/.1;
	}
	else if (feedCombo == "foodWaste"){
		var bioOut = 0.0112*feedVol/.1;
	}
	else if (feedCombo == "cowPig"){
		var bioOut = (0.0039*(1-feedComp/100)**2-0.011*(1-feedComp/100)+0.0288)*(feedVol/.1);
	}
	else if (feedCombo == "cowFood"){
		var bioOut = (0.0195*(1-feedComp/100)**2-0.0365*(1-feedComp/100)+0.0288)*(feedVol/.1);
	}
	else if (feedCombo == "pigFood"){
		var bioOut = (0.0066*(1-feedComp/100)**2-0.0173*(1-feedComp/100)+0.02215)*(feedVol/.1);
	}
	// (5) Total Biogas (L/yr) assuming linear relation
	var totalBioPerYr = bioOut*opDays;
	// Hard code in electricity conversion (!!!) This part is so messed up
	if (feedCombo == "cowManure"){
		var MePerYr = 0.2647*totalBioPerYr;
	}	
	else if (feedCombo == "pigManure"){
		var MePerYr = 0.2549*totalBioPerYr;
	}
	else if (feedCombo == "foodWaste"){
		var MePerYr = 0.257*totalBioPerYr;
	}
	else if (feedCombo == "cowPig"){
		var MePerYr = (0.0001*(1-feedComp/100)**2-0.01*(1-feedComp/100)+0.2647)*totalBioPerYr;
	}
	else if (feedCombo == "cowFood"){
		var MePerYr = (0.0083*(1-feedComp/100)**3-0.0299*(1-feedComp/100)**2+0.0138*(1-feedComp/100)+0.2647)*totalBioPerYr;
	}
	else if (feedCombo == "pigFood"){
		var MePerYr = (-0.0051*(1-feedComp/100)**3-0.0009*(1-feedComp/100)**2+0.008*(1-feedComp/100)+0.2549)*totalBioPerYr;
	}
	//HAVE TO CONVERT TO m**3
	var MePerYr = MePerYr/1000; // L/day -> m**3 methane per yr
	// (6) Energy Value Computation
	var kWhPerYr = 1000*naturalGasEVal*MePerYr/3.6;
	// (7) Total Electricity Savings ($/yr)
	var ESavings = EPrice*kWhPerYr;	
	// (8) Renewable Energy Credits and Tax Breaks
	var creditValPerYr = kWhPerYr/1000*creditVal;
	// (9) Adjusting for Num Biodigesters
	// (10) O&M Costs
	// (11) Town Taxes
	// (12) SSO Tipping Revenues (Assume something about density and all have same tipping fee)
	//Densities in tons per Liter
	var cowManureDensity = 0.001108925;
	var pigManureDensity = 0.001108925;
	var foodWasteDensity = 0.00130795;
	if (feedCombo == "cowManure"){
		var FeedTonPerYr = feedVol*opDays*cowManureDensity;
	}
	else if (feedCombo == "pigManure"){
		var FeedTonPerYr = feedVol*opDays*pigManureDensity;
	}
	else if (feedCombo == "foodWaste"){
		var FeedTonPerYr = feedVol*opDays*foodWasteDensity;
	}
	else if (feedCombo == "cowPig"){
		var FeedTonPerYr = feedVol*opDays*((feedComp/100)*cowManureDensity + (1-feedComp/100)*pigManureDensity);
	}
	else if (feedCombo == "cowFood"){
		var FeedTonPerYr = feedVol*opDays*((feedComp/100)*cowManureDensity + (1-feedComp/100)*foodWasteDensity);
	}
	else if (feedCombo == "pigFood"){
		var FeedTonPerYr = feedVol*opDays*((feedComp/100)*pigManureDensity + (1-feedComp/100)*foodWasteDensity);
	}
	//var SSOTonPerYr = (1.084*SSOPro/2000*opDays/0.3);
	//var WBTonPerYr = (0.5*WBPro/2000*opDays/0.06);

	var TipRev1 = tipFee1 * FeedTonPerYr;
	var TipRev2 = tipFee2 * FeedTonPerYr;

	//var TipRev1 = tipFee1 * (1.084*SSOPro/2000*opDays/0.3);
	//var TipRev2 = tipFee2 * (1.084*SSOPro/2000*opDays/0.3); 

	// (13) Depreciation
	var depreciationVal = totalCC * (1-salvagePercent) / depreciationYrs;

	// Update Results on Site
	document.getElementById("bioOut").innerHTML = bioOut.toFixed(2);
	document.getElementById("totalBioPerYr").innerHTML = totalBioPerYr.toFixed(2);
	document.getElementById("MePerYr").innerHTML = MePerYr.toFixed(2);
	document.getElementById("kWhPerYr").innerHTML = kWhPerYr.toFixed(2);
	document.getElementById("ESavings").innerHTML = "$" + ESavings.toFixed(2);
	document.getElementById("creditValPerYr").innerHTML = "$" + creditValPerYr.toFixed(2);
	document.getElementById("FeedTonPerYr").innerHTML = FeedTonPerYr.toFixed(2);
	document.getElementById("TipRev1").innerHTML = "$" + TipRev1.toFixed(2);
	document.getElementById("TipRev2").innerHTML = "$" + TipRev2.toFixed(2);
	document.getElementById("depreciationVal").innerHTML = "$" + depreciationVal.toFixed(2);

	// Results Table ("book")
	var bookBody = document.getElementById("book-body");

	var laborTable = Array(17);
	var OMTable = Array(17);
	var taxTable = Array(17);
	var TipRevTable = Array(17);
	var ESavingsTable = Array(17);
	var ECreditsTable = Array(17);
	var SLDTable = Array(17);
	var salvageTable = Array(17);
	var capitalTable = Array(17);
	var sumTable = Array(17);
	
	yearTable[0] = 0;
	laborTable[0] = 0;
	OMTable[0] = 0;
	taxTable[0] = 0;
	TipRevTable[0] = 0;
	ESavingsTable[0] = 0;
	ECreditsTable[0] = 0;
	SLDTable[0] = 0;
	salvageTable[0] = 0;
	capitalTable[0] = -totalCC;

	for (var i = 1; i < yearTable.length; i++) {
		yearTable[i] = i;
		laborTable[i] = -(numWorkers*workCost)*Math.pow(1.03,i-1);
		OMTable[i] = -OMCosts;
		taxTable[i] = -tax;
		if (i < tipTransition) {
			TipRevTable[i] = TipRev1;
		} else {
			TipRevTable[i] = TipRev2;
		}
		ESavingsTable[i] = ESavings;
		ECreditsTable[i] = creditValPerYr;
		if (i <= depreciationYrs) {
			SLDTable[i] = depreciationVal;
		} else {
			SLDTable[i] = 0;
		}
		if (i === yearTable.length-1) {
			salvageTable[i] = salvagePercent*totalCC;
			capitalTable[i] = workingCapital;
		} else {
			salvageTable[i] = 0;
			capitalTable[i] = 0;
		}
	}

	for (var i = 0; i < yearTable.length; i++) {
		// Sums and NPV
		sumTable[i] = laborTable[i] + OMTable[i] + taxTable[i] + TipRevTable[i] + ESavingsTable[i] + ECreditsTable[i] + SLDTable[i] + salvageTable[i] + capitalTable[i];
		PVTable[i] = sumTable[i]/Math.pow((1+discountRate),yearTable[i]);

		// Year column
		bookBody.rows[i].cells[0].innerHTML = yearTable[i];
		if (i === 0) {
			bookBody.rows[i].cells[1].innerHTML = '$'+laborTable[i].toFixed(2);
			bookBody.rows[i].cells[2].innerHTML = '$'+OMTable[i].toFixed(2);
			bookBody.rows[i].cells[3].innerHTML = '$'+taxTable[i].toFixed(2);
			bookBody.rows[i].cells[4].innerHTML = '$'+TipRevTable[i].toFixed(2);
			bookBody.rows[i].cells[5].innerHTML = '$'+ESavingsTable[i].toFixed(2);
			bookBody.rows[i].cells[6].innerHTML = '$'+ECreditsTable[i].toFixed(2);
			bookBody.rows[i].cells[7].innerHTML = '$'+SLDTable[i].toFixed(2);
			bookBody.rows[i].cells[8].innerHTML = '$'+salvageTable[i].toFixed(2);
			bookBody.rows[i].cells[9].innerHTML = '-$'+Math.abs(capitalTable[i]).toFixed(2);
			bookBody.rows[i].cells[10].innerHTML = '-$'+Math.abs(sumTable[i]).toFixed(2);
			bookBody.rows[i].cells[11].innerHTML = '-$'+Math.abs(PVTable[i]).toFixed(2);
		} else {
			// Labor column
			bookBody.rows[i].cells[1].innerHTML = laborTable[i].toFixed(2);
			// O&M Column
			bookBody.rows[i].cells[2].innerHTML = OMTable[i].toFixed(2);
			// Tax Column
			bookBody.rows[i].cells[3].innerHTML = taxTable[i].toFixed(2);
			// SSO tip Revenue Column
			bookBody.rows[i].cells[4].innerHTML = TipRevTable[i].toFixed(2);
			// Electricity Savings Column
			bookBody.rows[i].cells[5].innerHTML = ESavingsTable[i].toFixed(2);
			// Energy Credits Column
			bookBody.rows[i].cells[6].innerHTML = ECreditsTable[i].toFixed(2);
			// SLD Column
			bookBody.rows[i].cells[7].innerHTML = SLDTable[i].toFixed(2);
			// Salvage Column
			bookBody.rows[i].cells[8].innerHTML = salvageTable[i].toFixed(2);
			// Capital Column
			bookBody.rows[i].cells[9].innerHTML = capitalTable[i].toFixed(2);
			// PV
			bookBody.rows[i].cells[10].innerHTML = sumTable[i].toFixed(2);
			// NPV
			bookBody.rows[i].cells[11].innerHTML = PVTable[i].toFixed(2);
		}

	}

	var NPV = PVTable.reduce((a, b) => a + b, 0);
	document.getElementById("NPV").innerHTML = "<b><u>Net Present Value ($):</u></b> " + NPV.toFixed(2);

	// Sensitivity Analysis
	var sensBody = document.getElementById("sensitivity-body");
	// Vary feedVol
	//console.log(NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax));
	sensArray[0][0] = NPVOnly(1.1*feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[0][1] = NPVOnly(0.9*feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[1].innerHTML = sensArray[0][0].toFixed(2);
	sensBody.rows[1].cells[1].innerHTML = sensArray[0][1].toFixed(2);
	// Vary EPrice
	sensArray[1][0] = NPVOnly(feedVol,naturalGasEVal,1.1*EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[1][1] = NPVOnly(feedVol,naturalGasEVal,0.9*EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[2].innerHTML = sensArray[1][0].toFixed(2);
	sensBody.rows[1].cells[2].innerHTML = sensArray[1][1].toFixed(2);
	// Vary creditVal
	sensArray[2][0] = NPVOnly(feedVol,naturalGasEVal,EPrice,1.1*creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[2][1] = NPVOnly(feedVol,naturalGasEVal,EPrice,0.9*creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[3].innerHTML = sensArray[2][0].toFixed(2);
	sensBody.rows[1].cells[3].innerHTML = sensArray[2][1].toFixed(2);
	// Vary tip fees
	sensArray[3][0] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,1.1*tipFee1,1.1*tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[3][1] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,0.9*tipFee1,0.9*tipFee2,workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[4].innerHTML = sensArray[3][0].toFixed(2);
	sensBody.rows[1].cells[4].innerHTML = sensArray[3][1].toFixed(2);
	// Vary OM Costs
	sensArray[4][0] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,1.1*OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[4][1] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,0.9*OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[5].innerHTML = sensArray[4][0].toFixed(2);
	sensBody.rows[1].cells[5].innerHTML = sensArray[4][1].toFixed(2);
	// Vary Taxes
	sensArray[5][0] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,1.1*tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[5][1] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,0.9*tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[6].innerHTML = sensArray[5][0].toFixed(2);
	sensBody.rows[1].cells[6].innerHTML = sensArray[5][1].toFixed(2);
	// Vary Work Costs
	sensArray[6][0] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,1.1*workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensArray[6][1] = NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,0.9*workCost,OMCosts,tax).toFixed(2) - NPVOnly(feedVol,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2);
	sensBody.rows[0].cells[7].innerHTML = sensArray[6][0].toFixed(2);
	sensBody.rows[1].cells[7].innerHTML = sensArray[6][1].toFixed(2);

	// Charts
	PVChart.data.datasets.data = PVTable;
	PVChart.update();
	sensChart.data.datasets[0].data = [sensArray[0][0],sensArray[1][0],sensArray[2][0],sensArray[3][0],sensArray[4][0],sensArray[5][0],sensArray[6][0]];
	sensChart.data.datasets[1].data = [sensArray[0][1],sensArray[1][1],sensArray[2][1],sensArray[3][1],sensArray[4][1],sensArray[5][1],sensArray[6][1]];
	sensChart.update();
}

function NPVOnly(feedVolume,EVal,EPr,crVal,fee1,fee2,wCost,OM,tx) {
	if (feedCombo == "cowManure"){
		var bioOut = 0.0288*feedVolume/.1;
	}
	else if (feedCombo == "pigManure"){
		var bioOut = 0.02215*feedVolume/.1;
	}
	else if (feedCombo == "foodWaste"){
		var bioOut = 0.0112*feedVolume/.1;
	}
	else if (feedCombo == "cowPig"){
		var bioOut = (0.0039*(1-feedComp/100)**2-0.011*(1-feedComp/100)+0.0288)*(feedVolume/.1);
	}
	else if (feedCombo == "cowFood"){
		var bioOut = (0.0195*(1-feedComp/100)**2-0.0365*(1-feedComp/100)+0.0288)*(feedVolume/.1);
	}
	else if (feedCombo == "pigFood"){
		var bioOut = (0.0066*(1-feedComp/100)**2-0.0173*(1-feedComp/100)+0.0215)*(feedVolume/.1);
	}
	// (5) Total Biogas (L/yr) assuming linear relation
	var totalBioPerYr = bioOut*opDays;
	if (feedCombo == "cowManure"){
		var MePerYr = 0.2647*totalBioPerYr;
	}
	else if (feedCombo == "pigManure"){
		var MePerYr = 0.2549*totalBioPerYr;
	}
	else if (feedCombo == "foodWaste"){
		var MePerYr = 0.257*totalBioPerYr;
	}
	else if (feedCombo == "cowPig"){
		var MePerYr = (0.0001*(1-feedComp/100)**2-0.01*(1-feedComp/100)+0.2647)*totalBioPerYr;
	}
	else if (feedCombo == "cowFood"){
		var MePerYr = (0.0083*(1-feedComp/100)**3-0.0299*(1-feedComp/100)**2+0.0138*(1-feedComp/100)+0.2647)*totalBioPerYr;
	}
	else if (feedCombo == "pigFood"){
		var MePerYr = (-0.0051*(1-feedComp/100)**3-0.0009*(1-feedComp/100)**2+0.008*(1-feedComp/100)+0.2549)*totalBioPerYr;
	}
	var MePerYr = MePerYr/1000;// m**3 methane per yr
	// (6) Energy Value Computation
	var kWhPerYr = 1000*naturalGasEVal*MePerYr/3.6;
	// (7) Total Electricity Savings ($/yr)
	var ESavings = EPr*kWhPerYr;
	// (8) Renewable Energy Credits and Tax Breaks
	var creditValPerYr = kWhPerYr/1000*crVal;
	// (12) Tipping Revenues
	//Densities in tons per Liter
	var cowManureDensity = 0.001108925;
	var pigManureDensity = 0.001108925;
	var foodWasteDensity = 0.00130795;
	if (feedCombo == "cowManure"){
		var FeedTonPerYr = feedVolume*opDays*cowManureDensity;
	}
	else if (feedCombo == "pigManure"){
		var FeedTonPerYr = feedVolume*opDays*pigManureDensity;
	}
	else if (feedCombo == "foodWaste"){
		var FeedTonPerYr = feedVolume*opDays*foodWasteDensity;
	}
	else if (feedCombo == "cowPig"){
		var FeedTonPerYr = feedVolume*opDays*((feedComp/100)*cowManureDensity + ((1-feedComp/100))*pigManureDensity);
	}
	else if (feedCombo == "cowFood"){
		var FeedTonPerYr = feedVolume*opDays*((feedComp/100)*cowManureDensity + ((1-feedComp/100))*foodWasteDensity);
	}
	else if (feedCombo == "pigFood"){
		var FeedTonPerYr = feedVolume*opDays*((feedComp/100)*pigManureDensity + ((1-feedComp/100))*foodWasteDensity);
	}
	var TipRev1 = fee1 * FeedTonPerYr;
	var TipRev2 = fee2 * FeedTonPerYr;
	// (13) Depreciation
	var depreciationVal = totalCC * (1-salvagePercent) / depreciationYrs;

	// Results Table ("book")
	
	var laborTable = Array(17);
	var OMTable = Array(17);
	var taxTable = Array(17);
	var TipRevTable = Array(17);
	var ESavingsTable = Array(17);
	var ECreditsTable = Array(17);
	var SLDTable = Array(17);
	var salvageTable = Array(17);
	var capitalTable = Array(17);
	var sumTable = Array(17);
	var PVTable = Array(17);
	
	yearTable[0] = 0;
	laborTable[0] = 0;
	OMTable[0] = 0;
	taxTable[0] = 0;
	TipRevTable[0] = 0;
	ESavingsTable[0] = 0;
	ECreditsTable[0] = 0;
	SLDTable[0] = 0;
	salvageTable[0] = 0;
	capitalTable[0] = -totalCC;

	for (var i = 1; i < yearTable.length; i++) {
		yearTable[i] = i;
		laborTable[i] = -(numWorkers*wCost)*Math.pow(1.03,i-1);
		OMTable[i] = -OM;
		taxTable[i] = -tx;
		if (i < tipTransition) {
			TipRevTable[i] = TipRev1;
		} else {
			TipRevTable[i] = TipRev2;
		}
		ESavingsTable[i] = ESavings;
		ECreditsTable[i] = creditValPerYr;
		if (i <= depreciationYrs) {
			SLDTable[i] = depreciationVal;
		} else {
			SLDTable[i] = 0;
		}
		if (i === yearTable.length-1) {
			salvageTable[i] = salvagePercent*totalCC;
			capitalTable[i] = workingCapital;
		} else {
			salvageTable[i] = 0;
			capitalTable[i] = 0;
		}
	}

	for (var i = 0; i < yearTable.length; i++) {
		// Sums and NPV
		sumTable[i] = laborTable[i] + OMTable[i] + taxTable[i] + TipRevTable[i] + ESavingsTable[i] + ECreditsTable[i] + SLDTable[i] + salvageTable[i] + capitalTable[i];
		PVTable[i] = sumTable[i]/Math.pow((1+discountRate),yearTable[i]);
	}

	return PVTable.reduce((a, b) => a + b, 0);
}

// Navigation
function nav(location) {
    document.getElementById("home").style.display = location == 1 ? 'block' : 'none';
	document.getElementById("past-work").style.display = location == 2 ? 'block' : 'none';
	document.getElementById("about-us").style.display = location == 3 ? 'block' : 'none';
	document.getElementById("calculator").style.display = location == 4 ? 'block' : 'none';
}

// Charts
var PVctx = document.getElementById('PV-chart');
var PVChart = new Chart(PVctx, {
	type: 'bar',
	data: {
		labels: yearTable,
		datasets: [{
			label: 'Cash Flow',
			data: PVTable,
			backgroundColor: 'rgba(27, 171, 44, 0.3)',
			borderColor: 'rgba(27, 171, 44, 0.7)',
			borderWidth: 1
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Discounted Cash Flow Diagram',
			fontSize: 20,
			fontColor: '#353535'
		},
		scales: {
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Cash Flow ($)',
					fontSize: 16,
					fontColor: '#353535'
				}
			}],
			xAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Years of Operation',
					fontSize: 16,
					fontColor: '#353535'
				}
			}]
		},
		tooltips: {
			enabled: false
		},
		legend: {
			display: false
		},
		aspectRatio: 3
	}
});

var sensctx = document.getElementById('sensitivity-chart');
var sensChart = new Chart(sensctx, {
	type: 'horizontalBar',
	data: {
		labels: ['Feed Processing','Electricity Price','Renewable Energy Credit Value','Tipping Fees','O&M Costs','Town Taxes','Cost Per Worker'],
		datasets: [{
			label: '+10%',
			data: [sensArray[0][0],sensArray[1][0],sensArray[2][0],sensArray[3][0],sensArray[4][0],sensArray[5][0],sensArray[6][0]],
			backgroundColor: 'rgba(27, 171, 44, 0.3)',
			borderColor: 'rgba(27, 171, 44, 0.7)',
			borderWidth: 1
		},
		{
			label: '-10%',
			data: [sensArray[0][1],sensArray[1][1],sensArray[2][1],sensArray[3][1],sensArray[4][1],sensArray[5][1],sensArray[6][1]],
			backgroundColor: 'rgba(179, 27, 27, 0.3)',
			borderColor: 'rgba(179, 27, 27, 0.7)',
			borderWidth: 1	
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Sensitivity Diagram',
			fontSize: 20,
			fontColor: '#353535'
		},
		tooltips: {
			enabled: false
		},
		scales: {
            xAxes: [{
				stacked: true,
				scaleLabel: {
					display: true,
					labelString: 'Change in NPV',
					fontSize: 16,
					fontColor: '#353535'
				}
            }],
            yAxes: [{
                stacked: true
            }]
		},
		aspectRatio: 3
	}
});
