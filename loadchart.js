function LoadChart(el, chartConfig, reports) {
    this.el = el;
    this.chartConfig = chartConfig;
    this.rows = [];
    this.reportIndex = 0;
    this.reports = reports;
    this.chartJson = {};
    this.init();
    this.getData(reports[0]);

}

function cleanAdd(target, value) {
    var newValue = 0;
    if (target) {

        newValue = target + value;

    } else {

        newValue = value;

    }
    return newValue;
}

LoadChart.prototype.init = function () {

    this.chartJson = {
        "cols": [
            {"id": "", "label": "commitNumber", "type": "string"}
        ]
    };

    for (var i=0; i<this.reports.length; i++) {
        for (var j = 0; j < this.chartConfig.targets.length; j++) {

            if(this.chartConfig.resourceGraph) {
                for (var q = 0; q < this.chartConfig.metrics.length; q++) {

                    this.chartJson['cols'].push({"id": "", "label": this.chartConfig.targets[j].title + " " + this.chartConfig.metrics[q] + " (" + this.reports[i].name + ")", "type": "number"});

                }

            } else {

                this.chartJson['cols'].push({"id": "", "label": this.chartConfig.targets[j].title + " (" + this.reports[i].name + ")", "type": "number"});

            }


        }


    }




};


LoadChart.prototype.getData = function(report) {
    var self = this;

    var jqxhr = $.getJSON(report.file, function (data) {

        for (var i = 0; i < data.length; i++) {

            if(self.chartConfig.resourceGraph) {

                if(self.rows[i] !== undefined) {
                    self.populateResourceData(data[i], i);
                } else {
                    self.rows.push(self.populateResourceData(data[i], i));
                }


            } else {

                if(self.rows[i] !== undefined) {
                    self.populatePageData(data[i], i);
                } else {
                    self.rows.push(self.populatePageData(data[i], i));
                }
            }
        }




    }).done(function() {
        self.reportIndex++;
        if (self.reportIndex < self.reports.length) {
            self.getData(self.reports[self.reportIndex]);
        } else {
            self.graphData();
        }
    });

};

LoadChart.prototype.populateResourceData = function(data, index) {

    var targetTotal = 0;
    var targetDuration = [];
    var targetEnd = [];
    var targetSize = [];
    var targets = this.chartConfig.targets;

    for (var j = 0; j < data.resource.length; j++) {

        for (var q = 0; q < targets.length; q++) {

            if (this.isTargetResource(data.resource[j].url, targets[q].id)) {
                targetDuration[targets[q].name] = cleanAdd(targetDuration[targets[q].name], data.resource[j].duration);
                targetSize[targets[q].name] = cleanAdd(targetSize[targets[q].name], data.resource[j].size);
                targetEnd[targets[q].name] = data.resource[j].end;
            }

        }
    }

    if (this.rows[index] !== undefined) {
        var singleTargetRow = this.rows[index];
    } else {
        var singleTargetRow = {
            "c": [{"v": index}
            ]
        };
    }
    for (j = 0; j < targets.length; j++) {

        var node = {};

        for (q = 0; q < this.chartConfig.metrics.length; q++) {
            switch(this.chartConfig.metrics[q]) {
                case "size":
                    node = {"nodeid1": targets[j].title + " " + this.chartConfig.metrics[q] + " (" + this.reports[this.reportIndex].name + ")", "v": targetSize[targets[j].name]};
                    singleTargetRow['c'].push(node);
                    break;
                case "duration":
                    node = {"nodeid1": targets[j].title + " " + this.chartConfig.metrics[q] + " (" + this.reports[this.reportIndex].name + ")", "v": targetDuration[targets[j].name]};
                    singleTargetRow['c'].push(node);
                    break;
                case "end":
                    node = {"nodeid1": targets[j].title + " " + this.chartConfig.metrics[q] + " (" + this.reports[this.reportIndex].name + ")", "v": targetEnd[targets[j].name]};
                    singleTargetRow['c'].push(node);
                    break;
                default :
                    node = {"nodeid1": targets[j].title + " duration"  + " (" + this.reports[this.reportIndex].name + ")", "v": targetDuration[targets[j].name]};
                    singleTargetRow['c'].push(node);
            }

        }

    }
    return singleTargetRow;
};

LoadChart.prototype.isTargetResource = function(url, targets) {
    for (var i=0; i < targets.length; i++) {
        if(url.indexOf(targets[i]) > 0) {
            return true;
        }
    }
    return false;
};

LoadChart.prototype.populatePageData = function(data, index) {

    var targets = this.chartConfig.targets;
    if (this.rows[index]) {
        var singleRow = this.rows[index];
    } else {
        var singleRow = {
            "c": [{"v": index}]
        };
    }


    for (var j = 0; j<targets.length; j++) {
        singleRow['c'].push({"nodeid1": targets[j].title + " (" + this.reports[this.reportIndex] + ")", "v": data[targets[j].name]})
    }
    return singleRow;

};


LoadChart.prototype.graphData = function() {
    this.chartJson['rows'] = this.rows;

    var newData = new google.visualization.DataTable(this.chartJson);
    var options = this.chartConfig.options;
    var chart = new google.visualization.LineChart(document.getElementById(this.el));
    chart.draw(newData, options);


};

window.LoadChart = LoadChart;

