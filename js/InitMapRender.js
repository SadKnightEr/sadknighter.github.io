function InitWorldMap(mapDomElem, mapSrc) {
    $.ajax({
        type: 'GET',
        url: mapSrc,
        async: false,
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            InitRender(mapDomElem, data);
        },
        error: function (e) {
            console.log(e);

        }
    });
}
function InitRender(elem, data) {
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
                var message = '<p>' + region.toUpperCase() + ' (' + code.toUpperCase() + ')</p><p> ' + elementInfo+'</p>';
                tooltip
                    .html(message)
                    .style("visibility", "visible")
            }
        }
    });
    $('#vmap').bind('click', function (ev) {
        x = ev.clientX - offset.left;
        y = ev.clientY - offset.top;

        $display.text('x: ' + x + ', y: ' + y);
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