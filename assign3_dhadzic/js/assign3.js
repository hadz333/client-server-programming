$(function () {


    // save the downloaded visits data for subsequent filtering
    var visitsData;
    // save the downloaded browser, country, and OS data for subsequent charting
    var countryData;
    var browserData;
    var osData;


    // populate the filters
    loadCountriesFilter();
    loadBrowsersFilter();
    loadOSFilter();

    // set up google charts
    google.charts.load('current', {'packages':['corechart', 'geochart']});

    // now construct visits table
    readVisitsandConstructTable();

    // handlers for the filter events
    $("#filterCountry").on("change", function (e) {
        var choice = $(this).val();
        handleFilterEvent(choice, function (singleVisit, index) {
            return choice == singleVisit.country_code;
        })
    });
    $("#filterBrowser").on("change", function (e) {
        var choice = $(this).val();
        handleFilterEvent(choice, function (singleVisit, index) {
            return choice == singleVisit.browser_id;
        })
    });
    $("#filterOS").on("change", function (e) {
        var choice = $(this).val();
        handleFilterEvent(choice, function (singleVisit, index) {
            return choice == singleVisit.os_id;
        })
    });


    /* ---------------------------------------- HELPER FUNCTIONS ------------------------------  */

    /*
        Generic handler for visits filter events ... passed filter choice and the function used by
        grep to filter the data
    */
    function handleFilterEvent(choice, comparator) {

        if (choice == 0) {
            var revisedData = visitsData;
        }
        else {
            var revisedData = $.grep(visitsData, comparator);
        }

        $("#visitsBody").empty();
        makeVisitsTable(revisedData);
    }


    /*
        get visits informationa and then construct table of vist information
    */
    function readVisitsandConstructTable() {
        $.get("http://www.randyconnolly.com/funwebdev/services/visits/visits.php","continent=EU&month=1&limit=100")
            .done(function(data) {
                visitsData = data;
                makeVisitsTable(data);
                makeCountryChart();
                makePieChart();
                makeColumnChart()
            })
            .fail(function(xhr,status,error) {
                alert("failed loading visits data - status=" + status + " error=" + error);
            })
            .always(function(data) {
                //$('.animLoading').fadeOut("slow");
            });
    }


    /*
        Construct table of vist information using passed data
    */
    function makeVisitsTable(data) {

        $.each(data, function(index,value) {

            var row = $('<tr></tr>');

            var td1 = $('<td>' + value.id + '</td>').appendTo(row);

            var displayDate = new Date( value.visit_date );
            var td2 = $('<td class="mdl-data-table__cell--non-numeric">' + displayDate.toDateString() + '</td>').appendTo(row);
            var td2 = $('<td class="mdl-data-table__cell--non-numeric">' + value.country + '</td>').appendTo(row);
            var td3 = $('<td class="mdl-data-table__cell--non-numeric">' + value.browser+ '</td>').appendTo(row);
            var td4 = $('<td class="mdl-data-table__cell--non-numeric">' + value.operatingSystem + '</td>').appendTo(row);

            row.appendTo("#visitsBody");
        });
    }


    /*
        Populate countries filter drop-down with data from web service
    */
    function loadCountriesFilter() {
        $.get("http://www.randyconnolly.com/funwebdev/services/visits/countries.php","continent=EU")
            .done(function(data) {
                countryData = data;
                $.each(data, function(index,value) {

                    var opt = $('<option></option>').html(value.name).val(value.iso);
                    opt.appendTo("#filterCountry");
                    value.count = 0;
                });


            })
            .fail(function(xhr,status,error) {
                alert("failed loading country data - status=" + status + " error=" + error);
            })
            .always(function(data) {
                //$('.animLoading').fadeOut("slow");
            });
    }


    /*
        Populate browsers filter drop-down with data from web service
    */
    function loadBrowsersFilter() {
        //TO DO : complete this function ....
        $.get("http://www.randyconnolly.com/funwebdev/services/visits/browsers.php")
            .done(function(data) {
                browserData = data;
                var list = "";
                $.each(data, function(index,value) {
                  list += "<option value='" + value.id + "'>" + value.name + "</option>";
                  value.count = 0;
                });
                $("#filterBrowser").append(list);

            })
            .fail(function(xhr,status,error) {
                alert("failed loading browser data - status=" + status + " error=" + error);
            })
            .always(function(data) {
                //$('.animLoading').fadeOut("slow");
            });
    }


    /*
        Populate operating systems filter drop-down with data from web service
    */
    function loadOSFilter() {
            //TO DO : complete this function ....
            $.get("http://www.randyconnolly.com/funwebdev/services/visits/os.php")
                .done(function(data) {
                    osData = data;
                    var list = "";
                    $.each(data, function(index,value) {
                      list += "<option value='" + value.id + "'>" + value.name + "</option>";
                      value.count = 0;
                    });
                    $("#filterOS").append(list);

                })
                .fail(function(xhr,status,error) {
                    alert("failed loading OS data - status=" + status + " error=" + error);
                })
                .always(function(data) {
                    //$('.animLoading').fadeOut("slow");
                });
    }



    /*
     Creates a geo chart of the country field in the visits data
    */
    function makeCountryChart() {

        // first calculate aggregates that will be charted
        $.each(visitsData, function(index1,visit) {
            for (var i=0 ; i < countryData.length; i++) {
                if (visit.country_code == countryData[i].iso) {
                    countryData[i].count++;
                }
            }
        });

        // now display the Google geochart
        google.charts.setOnLoadCallback(drawRegionsMap);


        // callback function
        function drawRegionsMap() {
            // create a data array in format expected by the chart
            var table = [ ['Country', 'Count'] ];
            for (var i=0 ; i < countryData.length; i++) {
                if (countryData[i].count > 0) {
                    table.push( [ countryData[i].name, countryData[i].count ] );
                }
            }

            var data = google.visualization.arrayToDataTable(table);
            var options = {region: 150};
            var chart = new google.visualization.GeoChart(document.getElementById('geochart'));
            chart.draw(data, options);
        }
    }



    /*
     Creates a pie chart of the browser field in the visits data
    */
    function makePieChart() {
        //TO DO : complete this function ....
        $.each(visitsData, function(index1,visit) {
            for (var i=0 ; i < browserData.length; i++) {
                if (visit.browser_id == browserData[i].id) {
                    browserData[i].count++;
                }
            }
        });

        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
          var table = [ ['Browser', 'Count'] ];
          for (var i=0 ; i < browserData.length; i++) {
              if (browserData[i].count > 0) {
                  table.push( [ browserData[i].name, browserData[i].count ] );
              }
          }

          var options = {
            legend: {position: 'none'}
          };

          var data = google.visualization.arrayToDataTable(table);
          var chart = new google.visualization.PieChart(document.getElementById('piechart'));

          chart.draw(data, options);
        }
    }

    /*
     Creates a column chart of the operating system field in the visits data
    */
    function makeColumnChart() {
        //TO DO : complete this function ....
        $.each(visitsData, function(index1,visit) {
            for (var i=0 ; i < osData.length; i++) {
                if (visit.os_id == osData[i].id) {
                    osData[i].count++;
                }
            }
        });

        // google.charts.setOnLoadCallback(drawChart);

        // function drawChart() {
          var table = [ ['Operating System', 'Count'] ];
          for (var i=0 ; i < osData.length; i++) {
              if (osData[i].count > 0) {
                  table.push( [ osData[i].name, osData[i].count ] );
              }
          }

          var data = google.visualization.arrayToDataTable(table);
          var view = new google.visualization.DataView(data);
          //view.setColumns();

          var options = {
            legend: {position: 'none'},
            axisTitlesPosition: 'none',
            hAxis: {format: 'none', textPosition: 'none'},
            vAxis: {textPosition: 'none'}
          };


          var chart = new google.visualization.ColumnChart(document.getElementById('columnchart'));

          chart.draw(view, options);
        // }
    }



});
