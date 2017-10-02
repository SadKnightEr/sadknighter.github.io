function InitWorldMap(mapDomElem, dataSrc,regionSrc) {
    $.ajax({
        type: 'GET',
        url: dataSrc,
        async: true,
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
			GetRegionData(mapDomElem,regionSrc,data);
        },
        error: function (e) {
            console.log(e);

        }
    });
}
function GetRegionData(mapDomElem,regionSrc,mapData){
	$.ajax({
        type: 'GET',
        url: regionSrc,
        async: false,
        contentType: "application/json",
        dataType: 'json',
        success: function (regionData) {
            InitRender(mapDomElem, mapData,regionData);
        },
        error: function (e) {
            console.log(e);

        }
    });
}
function InitRender(elem, data,regionData) {
    var tooltip = d3.select(".container")
        .append("div")
        .attr('class', 'tooltip')
        .style("visibility", "hidden");
    var sampleData = ConvertJSONToJQVMAPFormat(data);
    $('#vmap').vectorMap({
        map: 'world_en',
        width: '100%',
        height: '100%',
        backgroundColor: '#ADD8E6',
        color: '#ffffff',
        hoverOpacity: 0.7,
        selectedColor: '#666666',
        enableZoom: true,
        showTooltip: true,
        scaleColors: ['#ffffe5', '#FFFFF'],
        values: sampleData,
        onRegionClick: function (element, code, region) {
            if (!touch_detect()) {
                var elementInfo = sampleData[code] !== undefined ? sampleData[code] : '0';
				var codeName=code.toUpperCase();
				var regionCustomName=regionData[codeName]!==undefined ? regionData[code] : region.toUpperCase();
                var message = '<p>' + regionCustomName + ' (' + codeName + ')</p><p> ' + elementInfo+'</p>';
				var leftPosition=d3.select('.jqvmap-label').style('left');
				var topPosition=d3.select('.jqvmap-label').style('top');
                tooltip
                    .html(message)
                    .style("visibility", "visible")
					.style("top",topPosition)
					.style("left",leftPosition)
            }
        }
    });
    $("#vmap").mousewheel(function (ev, val) {
        if (val > 0) {
            $('.jqvmap-zoomin').trigger('click');
        }
        else if (val < 0) {
            $('.jqvmap-zoomout').trigger('click');
        }
    });
}
function ConvertJSONToJQVMAPFormat(data) {
    try {
        var len = data.length;
        var strJSON = '{';
        for (var i = 0; i < len; i += 1) {
            if (data[i].country !== "None") {
                var countryCode = data[i].country.toLowerCase();
                strJSON += '"' + countryCode + '":"' + data[i].count_dtime + '"';
                if (i !== len - 1) {
                    strJSON += ',';
                }
            }
        }
        strJSON += "}";
        return JSON.parse(strJSON);
    }
    catch (err) {
        console.log("Error parsing data: " + err.message);
        return;
    }
}

function touch_detect() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints > 0;
}