// Initialize Firebase
let config = {
    apiKey: "AIzaSyCKSZ81yCPIE7Tn6PUZ6X93zgKThn5TmIs",
    authDomain: "cogentec-personal.firebaseapp.com",
    databaseURL: "https://cogentec-personal.firebaseio.com",
    projectId: "cogentec-personal",
    storageBucket: "cogentec-personal.appspot.com",
    messagingSenderId: "1080785279411"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();

let baseDocument = db.collection("/personal-manager").doc('timesheet');

let plotData = {};

baseDocument.get().then(renderGraphs);

function renderGraphs(doc) {
    let totalTasks = 0;
    let totalHours = 0;
    jsonData = doc.data();
    Object.keys(jsonData).forEach(function (dates, index) {
        jsonData[dates].forEach(function (task, i) {
            if (plotData[task.Application] === undefined)
                plotData[task.Application] = { 'count': 0, 'time': 0 };
            plotData[task.Application]['count']++;
            totalTasks++;
            plotData[task.Application]['time'] += parseFloat(task.Time_Hrs);
            totalHours += parseFloat(task.Time_Hrs);
        });
    });

    let countPlot = [];

    Object.keys(plotData).forEach(function (v, i) {
        let data = {};
        data['name'] = v;
        data['y'] = plotData[v].count;
        countPlot.push(data);
    });

    let hrsPlot = [];

    Object.keys(plotData).forEach(function (v, i) {
        let data = {};
        data['name'] = v;
        data['y'] = plotData[v].time;
        hrsPlot.push(data);
    });


    // Radialize the colors
    Highcharts.setOptions({
        colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        })
    });

    // Build the chart
    Highcharts.chart('projectTasks', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '# of requests resolved by Projects'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                },
                size: 170
            }
        },
        series: [{
            name: 'Percentage',
            data: countPlot
        }],
        credits: {
            enabled: false
        }
    });

    // Build the chart
    Highcharts.chart('projectHours', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Total Hours spent by Projects'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y:.1f} hrs',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                },
                size: 170
            }
        },
        series: [{
            name: 'Percentage',
            data: hrsPlot
        }],
        credits: {
            enabled: false
        }
    });

}
