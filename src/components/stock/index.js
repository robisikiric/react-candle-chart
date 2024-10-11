import React, { useState, useEffect } from 'react';
import { ExampleDataProvider } from './ExampleDataProvider';

const StockChart = () => {
    useEffect(() => {
        init();
    }, []);

    const init = () => {
        const dps1 = [], dps2 = [];
        const stockChart = new window.CanvasJS.StockChart("chartContainer", {
            title: {
                text: "Candle Chart"
            },
            subtitles: [{
                text: "SubTitle"
            }],
            charts: [{
                axisY: {
                    prefix: "$"
                },
                legend: {
                    verticalAlign: "top",
                    cursor: "pointer",
                    itemclick: function (e) {
                        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                            e.dataSeries.visible = false;
                        } else {
                            e.dataSeries.visible = true;
                        }
                        e.chart.render();
                    }
                },
                toolTip: {
                    shared: true
                },
                data: [{
                    type: "candlestick",
                    showInLegend: true,
                    name: "Stock Price",
                    yValueFormatString: "$#,###.00",
                    xValueType: "dateTime",
                    dataPoints: dps1
                }],
            }],
            navigator: {
                data: [{
                    dataPoints: dps2
                }],
                slider: {
                    minimum: new Date(2018, 3, 1),
                    maximum: new Date(2024, 5, 1)
                }
            }
        });

        const endDate = new Date(Date.now());
        const startDate = new Date();
        startDate.setHours(endDate.getHours() - 300);
        const priceBars = ExampleDataProvider.getRandomCandles(300, 60000, startDate, 60 * 60);

        for(var i = 0; i < priceBars.length; i++){
            dps1.push({x: new Date(priceBars[i].date), y: [Number(priceBars[i].open), Number(priceBars[i].high), Number(priceBars[i].low), Number(priceBars[i].close)]});
            dps2.push({x: new Date(priceBars[i].date), y: Number(priceBars[i].close)});
        }
        stockChart.render();
        var sma = calculateSMA(dps1, 7);
        stockChart.charts[0].addTo("data", { type: "line", dataPoints: sma, showInLegend: true, yValueFormatString: "$#,###.00", name: "Simple Moving Average"})
    }

    const calculateSMA = (dps, count) => {
        var avg = function(dps){
          var sum = 0, count = 0, val;
          for (var i = 0; i < dps.length; i++) {
            val = dps[i].y[3]; sum += val; count++;
          }
          return sum / count;
        };
        var result = [], val;
        count = count || 5;
        for (var i=0; i < count; i++)
          result.push({ x: dps[i].x , y: null});
        for (var i=count - 1, len=dps.length; i < len; i++){
          val = avg(dps.slice(i - count + 1, i));
          if (isNaN(val))
            result.push({ x: dps[i].x, y: null});
          else
            result.push({ x: dps[i].x, y: val});
        }
        return result;
    }

    return (
        <div id="chartContainer" style={{height: '500px', maxWidth: '920px'}}></div>
    )
}

export default StockChart;
