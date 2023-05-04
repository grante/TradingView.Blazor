window.charts = {};

export function loadChart(chartElement, chartRefId, chartType, mainSeriesData, volumeData, markerData, chartOptions) {
    if (chartElement == null) {
        console.error("ChartElement was null. Please define a reference for your TradingViewChart element.");
        return;
    }

    // Prepare chart element
    const chart = createChart();
    const mainSeries = createMainSeries();
    const volumeSeries = createVolumeSeries();

    // setupAutoResizing();

    // Fit the chart
    chart.timeScale().fitContent();

    // Store the chart information globally for later access 
    chart["MainSeries"] = mainSeries;
    chart["VolumeSeries"] = volumeSeries;
    window.charts[chartRefId] = chart;

    // success
    return true;

    function createChart() {
        const autoSizeWidth = chartOptions.width <= 0;
        const autoSizeHeight = chartOptions.height <= 0;

        return LightweightCharts.createChart(chartElement, {
            // negative value handled by resize script
            // note: keep width/height hard values above 0 or markers will break

            width: autoSizeWidth ? 0 : chartOptions.width,
            height: autoSizeHeight ? 0 : chartOptions.height,
            autoSize: autoSizeWidth,
            layout: {
                background: {
                    type: "solid",
                    color: chartOptions.layoutBackgroundColor,
                },
                textColor: chartOptions.layoutTextColor,
            },
            grid: {
                vertLines: {
                    color: chartOptions.vertLinesColor,
                },
                horzLines: {
                    color: chartOptions.horzLinesColor,
                },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: chartOptions.rightPriceScaleBorderColor,
            },
            timeScale: {
                borderColor: chartOptions.timeScaleBorderColor,
                timeVisible: chartOptions.timeScaleTimeVisible,
                secondsVisible: chartOptions.timeScaleSecondsVisible
            },
            // ...chartOptions.customChartDefinitions
        });
    }

    // -- MAIN SERIES

    function createMainSeries() {

        let newMainSeries;

        // Define chart layout
        if (chartType === 1) // Candle
        {
            newMainSeries = chart.addCandlestickSeries({
                upColor: 'rgb(38,166,154)',
                downColor: 'rgb(255,82,82)',
                wickUpColor: 'rgb(38,166,154)',
                wickDownColor: 'rgb(255,82,82)',
                borderVisible: true,
                priceFormat: {
                    type: 'price',
                    precision: chartOptions.rightPriceScaleDecimalPrecision,
                    minMove: 1 / (10 ** chartOptions.rightPriceScaleDecimalPrecision),
                },
                ...chartOptions.customCandleSeriesDefinitions
            });

            newMainSeries.setData(mainSeriesData);
        } else if (chartType === 2) // Line
        {
            newMainSeries = chart.addLineSeries({
                color: '#00C',
                lineWidth: 2,
                lineStyle: chartOptions.lineStyle,
                axisLabelVisible: true,
                borderVisible: true,
                priceFormat: {
                    type: 'price',
                    precision: chartOptions.rightPriceScaleDecimalPrecision,
                    minMove: 1 / (10 ** chartOptions.rightPriceScaleDecimalPrecision),
                },
                ...chartOptions.customLineSeriesDefinitions
            });

            newMainSeries.setData(mainSeriesData);
        } else console.error("ChartType was not defined or invalid. This is probably a C# bug.");

        // Bind MARKERS
        newMainSeries.setMarkers(markerData); // <- TODO: fix me

        return newMainSeries;
    }

    // -- VOLUME SERIES

    function createVolumeSeries() {

        // Define volume for chart layout
        const newVolumeSeries = chart.addHistogramSeries({
            priceFormat: {
                type: 'volume'
            },
            priceScaleId: '', // a blank scale id means this graph is scaled to the window size using the scaleMargins settings below
            priceLineVisible: false,
            lastValueVisible: true,

            // color: '#26a69a',
            // priceFormat: {
            // 	type: 'volume',
            // },
            // priceScaleId: '',
            // scaleMargins: {
            // 	top: -0.25,
            // 	bottom: -1,
            // },
            
            // ...chartOptions.customVolumeSeriesDefinitions
        });

        newVolumeSeries.setData(volumeData);

        newVolumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            }
        });

        return newVolumeSeries;
    }

    function setupAutoResizing() {
        // Force resize if applicable
        if (chartOptions.width <= 0) {
            let timerID;

            // Set size on initial load
            chart.resize(chartElement.parentElement.offsetWidth - (chartOptions.width * -1), chartOptions.height);

            // Regular check
            document.body.onresize = function () {
                if (timerID) clearTimeout(timerID);
                timerID = setTimeout(function () {
                    window.charts[chartRefId].resize(chartElement.parentElement.offsetWidth - (chartOptions.width * -1), chartOptions.height);
                }, 200);
            }
        }
    }
}

export function replaceChartData(chartRefId, chartType, mainSeriesData, volumeData, markerData) {
    window.charts[chartRefId]["MainSeries"].setData(mainSeriesData);
    window.charts[chartRefId]["MainSeries"].setMarkers(markerData);
    window.charts[chartRefId]["VolumeSeries"].setData(volumeData);
}