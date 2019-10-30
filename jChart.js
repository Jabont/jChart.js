function jChartCurve(id,data,chartType='bar',type,phase){
	let theLabel = [];
	let theData = [];
	let dataSize = 0;
	let dataSort = [];
	let newData = {};
	for(let i in data){
		dataSort.push(data[i].toFixed(2));
		dataSize++;
	}
	dataSort.sort(function(a, b){return a - b});
	let range = [];
	let slot = dataSize/(phase-1);
	nowSlot = dataSize;
	for (let i = 0; i < dataSize; i++) {
		if (newData[dataSort[i]] == undefined) {
			newData[dataSort[i]] = 1;
		}
		else{
			newData[dataSort[i]]++;
		}
	}
	if (type == 'x') {
		for (var i = dataSize - 1; i >= 0; i--) {
			if (i<=nowSlot) {
				range.push(dataSort[i]);
				nowSlot = nowSlot-slot;

			}
		}
	}
	else if(type == 'y'){
		range = phase;
	}
	jChart(id,newData,type,range);
}
function jChart(id,data,chartType='bar',colorType = 'default',range = 4){
	console.log(data);
	let theData = [];
	let theLabel = [];
	let theBg = [];
	let isMultiple = 0;
	let theTitle = document.getElementById(id).getAttribute('title');
	yMax = 0;
	for(let i in data){
		theLabel.push(i);
		theData.push(data[i]);
		if(data[i]>yMax){
			yMax = data[i];
		}
	}
	if (theData[0].length != undefined) {
		isMultiple = 1;
		theDataSetSize = theData[0].length;
	}
	let theDataSize = theLabel.length;
	if (isMultiple) {
		theDataMultiple = [];
		yMax = [];
		for (let dataSeti = 0; dataSeti < theDataSetSize; dataSeti++) {
			theDataMultiple[dataSeti] = [];
			yMax[dataSeti] = 0;
			theBg[dataSeti] = [];
			for (let i = 0; i < theDataSize; i++) {
				theDataMultiple[dataSeti].push(theData[i][dataSeti]);
				if (theData[i][dataSeti]>yMax[dataSeti]) {
					yMax[dataSeti]= theData[i][dataSeti];
				}
			}
		}
		
		theTitle = theTitle.split(',');
		console.log(theDataMultiple);
	}
	if (colorType == 'default') {
		let deg = 360/theDataSize;
		if (isMultiple) {
			for (let dataSeti = 0; dataSeti < theDataSetSize; dataSeti++) {
				for (let i = 0; i < theDataSize; i++) {
					theBg[dataSeti].push(hsl(${parseInt(i*deg)},100%,65%,.8));
				}
			}
		}else{
			for (let i = 0; i < theDataSize; i++) {
				theBg.push(hsl(${parseInt(i*deg)},100%,65%,.8));
			}
		}
	}
	else if(colorType == 'x') {
		rangeSize = range.length;
		let deg = 130/(rangeSize-2);
		if (deg == Infinity) {deg=65}
			console.log(deg = ${deg});
		for (var i = 0; i < theDataSize; i++) {
			for (let c = 0; c < rangeSize; c++) {
				if (parseFloat(theLabel[i])>=parseFloat(range[c])) {
					theBg.push(hsl(${parseInt((((rangeSize-c)-1)*deg)-20)},100%,65%,.8));
					break;
				}
			}
		}
	}
	else if(colorType == 'y') {
		if (range == 1) {
			range = 2;
		}
		if (isMultiple) {
			let slotY = [];
			let deg = 120/(range-1);
			for (let dataSeti = 0; dataSeti < theDataSetSize; dataSeti++) {
				slotY[dataSeti] = (yMax[dataSeti]+1)/range;
				for (var i = 0; i < theDataSize; i++) {
					let hue = parseInt(theDataMultiple[dataSeti][i]/slotY[dataSeti])*deg;
					theBg[dataSeti].push(hsl(${hue},100%,65%,.8));
				}
			}
		}
		else{
			let slotY = (yMax+1)/range;
			let deg = 120/(range-1);
			for (var i = 0; i < theDataSize; i++) {
				let hue = parseInt(theData[i]/slotY)*deg;
				theBg.push(hsl(${hue},100%,65%,.8));
			}
		}
	}
	var ctx = document.getElementById(id).getContext('2d');
	theDataSet = [];
	console.log(theTitle);
	if (isMultiple) {
		for (let dataSeti = 0; dataSeti < theDataSetSize; dataSeti++) {
			newDataSet = {
				label: theTitle[dataSeti],
				data: theDataMultiple[dataSeti],
				backgroundColor: theBg[dataSeti],
				borderWidth: 1
			};
			theDataSet.push(newDataSet);
		}
	}
	else{
		theDataSet = [{
			label: theTitle,
			data: theData,
			backgroundColor: theBg,
			borderWidth: 1
		}];
	}
	let myChart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: theLabel,
			datasets: theDataSet,
		},
		options: {
			responsive:true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					},
				}],

			}
		}
	});
}