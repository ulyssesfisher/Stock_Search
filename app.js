const stkList = ['NFLX', 'AMZN', 'MSFT', 'GOOG'];

const showStocks = function () {

    let stock = $(this).attr('data-name');
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=logo,quote,news&range=10m&last=10`;


    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        const stkDiv = $('<div>').addClass('stock');
        const compName = response.quote.companyName;
        const compNameHolder = $('<p>').text(`Company Name: ${compName}`);
        const compLogo = response.logo.url;
        compLogoHolder = $(`<img src = ${compLogo}>`);
        stkDiv.append(compLogoHolder);
        stkDiv.append(compNameHolder);
        const stkSymbol = response.quote.symbol;
        var symbolHolder = $('<p>').text(`Stock Symbol: ${stkSymbol}`);
        stkDiv.append(symbolHolder);
        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);
        stkDiv.append(priceHolder);
        const companyNews = response.news[0].summary;
        const summaryHolder = $('<p>').text(`News Headlines:`);
        stkDiv.append(summaryHolder);
        linebreak = function () { return document.createElement( 'BR' ); }


        $('#stocks-view').prepend(stkDiv);

        //Returns up to 10 news headlines instead of news summary. Breaks if object is empty/undefined.
        for (let i=0; i<10; i++){
             if (response.news[i] == undefined){
                break;
            }else {
            console.log(response.news[i].headline);
            stkDiv.append(response.news[i].headline);
            stkDiv.append(linebreak());
             } 

        };
    });

}

const render = function () {

    $('#buttons-view').empty();
    for (let i = 0; i < stkList.length; i++) {
        const newButton = $('<button>');
        newButton.addClass('stock-btn');
        newButton.attr('data-name', stkList[i]);
        newButton.text(stkList[i]);
        $('#buttons-view').append(newButton);
    }
}

const addButton = function (event) {
    event.preventDefault();
    const validationList = [];
    const queryURLall = `https://api.iextrading.com/1.0/ref-data/symbols`;
    $.ajax({
        url: queryURLall,
        method: 'GET'
    }).then(function (res) {
        //Pushes all symbols into an array.
        for (let i = 0; i < res.length; i++) {
            validationList.push(res[i].symbol)
        }

        console.log(validationList.length);

        let stock = $('#stock-input').val().trim();
        //Forces stock text to be capitalized for the text on the button and to compare to validation list.
        stock = stock.toUpperCase();

        console.log(validationList.includes(stock));

        // If the stock is in the validation list, a button will be assigned and data can be returned. If not, the user will be advised to make another selection.
        if (validationList.includes(stock)) {
            stkList.push(stock);
            console.log(stock);
            $('#stock-input').val('');
            render();
        }else 
        {
            // Notifies user stock is not in the database and to make another selection.
            alert("Oooops! We're sorry, your selection is not in our database. Try again.");
            (console.log(stock));
        };
    });
}
$('#add-stock').on('click', addButton);
$('#buttons-view').on('click', '.stock-btn', showStocks);
render();