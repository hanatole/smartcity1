let mymap = L.map("mymap"), present={length:0}, flag = 1, firstTime =true;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 5,
	minZoom: 1,
	attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

async function loadData(url){
	let latlngs=[];
	let markers = await fetch(url).then(response=>{
		return response.json();
	});
	markers = (markers.length===undefined)?[markers]:markers;
	markers.forEach(marker =>{
	if(firstTime){
		latlngs.push([marker.latitude, marker.longitude]);
	}
		update(marker);
	});
	clear();
	if(firstTime){
		mymap.fitBounds(latlngs);
		firstTime = false;
	}
}

function update(data){
	let coord = [data.latitude, data.longitude], id = data.id, marker;
	let text = "<strong>"+data.name+"</strong><br/>("+coord[0]+" ,"+coord[1]+")";
	if(present[id]===undefined){
		present[id]=[flag, L.marker(coord).addTo(mymap)];
		present.length +=1;
	}else{
		present[id][0] = flag;
		present[id][1].setLatLng(coord).bindPopup(text);
	}
}

function clear(){
	for(let id in present){
		if(id!=="length" && present[id][0]!=flag){
			present[id][1].remove();
			delete present[id];
			present.length -=1;
		}
	}
	flag = 1-flag;
}

let url = "https://api.wheretheiss.at/v1/satellites/25544";
//let url = "./base/data.json";
setInterval(function(){
	loadData(url);
},1000);