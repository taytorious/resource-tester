(function($, google, LoadChart) {
    google.load("visualization", "1", {packages: ["corechart"]});

    google.setOnLoadCallback(drawChart);



    function drawChart() {

        $.getJSON("config.json", function (data) {
            var mainChart = new LoadChart('chart_div', data.configs.main, data.configs.reports);
            var targetChart = new LoadChart('target_chart_div', data.configs.targets, data.configs.reports);
        });



    }
})(window.jQuery, window.google, window.LoadChart);