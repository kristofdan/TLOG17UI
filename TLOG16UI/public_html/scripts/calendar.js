$(document).ready(function(){
    setCalendarCaption(new Date());
    drawAndFillTableBody(new Date());
    
    //Setting event handlers for pager
    $("#pager-previous").click(function(){
        var dateOfPreviousMonth = calculateDateOfPreviousMonth();
        deleteTableBody();
        setCalendarCaption(dateOfPreviousMonth);
        drawAndFillTableBody(dateOfPreviousMonth);
    });

    $("#pager-next").click(function(){
        var dateOfNextMonth = calculateDateOfNextMonth();
        deleteTableBody();
        setCalendarCaption(dateOfNextMonth);
        drawAndFillTableBody(dateOfNextMonth);
    });
});



function drawAndFillTableBody(date){
    var tbody = createAndFillTbody(date);
        
    $("#calendar-table").append(tbody);
}

function setCalendarCaption(date){
    
    var monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
    ];
    $("#calendar-table caption").text(date.getFullYear() + " "
            + monthNames[date.getMonth()]);
}

function createAndFillTbody(date){
    var tbodySize = calculateTbodySize(date);
    var tbody = createAndFillCells(tbodySize);
    
    return tbody;
}

function calculateTbodySize(date){
    var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];
    var firstDayOfThisMonth = date;
    firstDayOfThisMonth.setDate(1);
    if (firstDayOfThisMonth.getFullYear() % 4 === 0){
        monthLengths[2] = 29;
    }
    
    var firstRowEmptyCellNumber;
    if (firstDayOfThisMonth.getDay() === 0){
        firstRowEmptyCellNumber = 6;
    }else {
        firstRowEmptyCellNumber = firstDayOfThisMonth.getDay() - 1;
    }
    var dayNumber = monthLengths[firstDayOfThisMonth.getMonth()];
    var cellNumber = dayNumber + firstRowEmptyCellNumber;
    var rowNumber = cellNumber / 7;
    rowNumber = Math.ceil(rowNumber);
    var lastRowEmptyCellNumber = (firstRowEmptyCellNumber + dayNumber) -
            (rowNumber * 7);
    
    var tbodySize = {rowNumber: rowNumber,
        firstRowEmptyCellNumber: firstRowEmptyCellNumber,
        dayNumber: dayNumber,
        lastRowEmptyCellNumber: lastRowEmptyCellNumber
    };
    return tbodySize;
}

function createAndFillCells(tbodySize){
    var tbody = document.createElement("tbody");
    
    var firstRow = createAndFillFirstRow(tbodySize);
    tbody.appendChild(firstRow);
    
    var currentDay = 7 - tbodySize.firstRowEmptyCellNumber + 1;
    for (var i=1; i<tbodySize.rowNumber - 1; ++i){
        var newRow = document.createElement("tr");
        var newCell = document.createElement("td");
        var textNode = document.createTextNode("This is a new row.");
        newCell.appendChild(textNode);
        newRow.appendChild(newCell);
        tbody.appendChild(newRow);
    }
    return tbody;
}

function createAndFillFirstRow(tbodySize){
    var currentDay = 1;
    var firstRow = document.createElement("tr");
    for (var i=0; i<tbodySize.firstRowEmptyCellNumber; ++i){
        var newCell = document.createElement("td");
        firstRow.appendChild(newCell);
    }
    for (var i=tbodySize.firstRowEmptyCellNumber; i<7; ++i){
        var newCell = document.createElement("td");
        var textNode = document.createTextNode(currentDay);
        currentDay++;
        newCell.appendChild(textNode);
        firstRow.appendChild(newCell);
    }
    return firstRow;
}

function calculateDateOfPreviousMonth(){
    var date = getDateFromCaption();
    var monthNumber = date.getMonth();
    if (monthNumber === 0){
        date.setFullYear(date.getFullYear() - 1);
        date.setMonth(11);
    }else {
        date.setMonth(monthNumber - 1);
    }
    return date;
}

function calculateDateOfNextMonth(){
    var date = getDateFromCaption();
    var monthNumber = date.getMonth();
    if (monthNumber === 11){
        date.setFullYear(date.getFullYear() + 1);
        date.setMonth(0);
    }else {
        date.setMonth(monthNumber + 1);
    }
    return date;
}

function getDateFromCaption(){
    var captionText = $("#calendar-table caption").text();
    var year = captionText.substring(0,4);
    var month = captionText.substring(5);
    var date = new Date(month + " 1 " + year);
    return date;
}

function deleteTableBody(){
    $("#calendar-table tbody").remove();
}