(function($, google) {
    google.load("visualization", "1", {packages: ["corechart"]});

    google.setOnLoadCallback(drawChart);

    function drawChart() {
        var rows = new Array();
        var columns = new Array();
        var target = ['outbrain', 'comscore', 'chartbeat'];


        var targetRows = new Array();
        var targetColumns = new Array();

        $.getJSON("reports/loadreport-wip.json", function (data) {
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                var singleRow = {
                    "c": [{"v": i},
                        {"node": "Elapsed Load Time", "v": data[i].elapsedLoadTime},
                        {"nodeid": "Total resources time", "v": data[i].totalResourcesTime},
                        {"nodeid1": "Number of resources", "v": data[i].numberOfResources},
                        {"nodeid1": "Total resources size", "v": data[i].totalResourcesSize},
                        {"nodeid1": "DOM ready state interactive", "v": data[i].domReadystateInteractive},
                        {"nodeid1": "DOM ready state loading", "v": data[i].domReadystateLoading},
                        {"nodeid1": "Non reporting resources", "v": data[i].nonReportingResources}

                    ]
                };

                rows.push(singleRow);
                $('#slowest').append('<li>Run' + i + " URL: " + data[i].slowestResource + '</li>');
                $('#largest').append('<li>Run' + i + " URL: " + data[i].largestResource + '</li>');

                var targetTotal = 0;
                var targetVals = new Array(target.length);
                for (var j = 0; j < data[i].resource.length; j++) {
                    $('#resource').append('<li>Run ' + i + " URL: " + data[i].resource[j].url + ' Size: ' + data[i].resource[j].size + ' bytes</li>');

                    for (var q = 0; q < target.length; q++) {
                        if (data[i].resource[j].url.indexOf(target[q]) > 0) {
                            targetTotal += data[i].resource[j].duration;        // Add the duration to our total
                            if (targetVals[target[q]]) {
                                targetVals[target[q]] += data[i].resource[j].duration;
                            } else {
                                targetVals[target[q]] = data[i].resource[j].duration;
                            }
                        }
                    }

                }

                var singleTargetRow = {
                    "c": [{"v": i},
                        {"node": "Target Total", "v": targetTotal},
                    ]
                };

                for (var q = 0; q < target.length; q++) {
                    var node = {"nodeid1": target[q], "v": targetVals[target[q]]}
                    singleTargetRow['c'].push(node);
                }

                targetRows.push(singleTargetRow);


                $('#resource').append('<li>**********************************************************************************************************</li>');

            }

            var jsonData = {
                "cols": [
                    {"id": "", "label": "commitNumber", "type": "string"},
                    {"id": "", "label": "Elapsed Load Time", "type": "number"},
                    {"id": "", "label": "Total resources time", "type": "number"},
                    {"id": "", "label": "Number of resources", "type": "number"},
                    {"id": "", "label": "Total resources size", "type": "number"},
                    {"id": "", "label": "DOM ready state interactive", "type": "number"},
                    {"id": "", "label": "DOM ready state loading", "type": "number"},
                    {"id": "", "label": "Non reporting resources", "type": "number"}
                ], "rows": rows
            };

            var newData = new google.visualization.DataTable(jsonData);
            var options = {
                title: 'Load test results ' + data[0].url,
                curveType: "function"
            };
            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(newData, options);

            var targetData = {
                "cols": [
                    {"id": "", "label": "commitNumber", "type": "string"},
                    {"id": "", "label": "Target Total", "type": "number"},
                ], "rows": targetRows
            };

            for (var q = 0; q < target.length; q++) {
                var node = {"id": "", "label": target[q], "type": "number"};
                targetData['cols'].push(node);
            }


            var chartTargetData = new google.visualization.DataTable(targetData);
            options = {
                title: 'Target Test Results (Outbrain, Comscore, Chartbeat) ' + data[0].url,
                curveType: "function"
            };

            var targetChart = new google.visualization.LineChart(document.getElementById('target_chart_div'));
            targetChart.draw(chartTargetData, options);
        });
    }
})(jQuery, google);