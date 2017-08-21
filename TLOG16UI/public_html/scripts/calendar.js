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

function setCalendarCaption(date){
    
    var monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
    ];
    $("#calendar-table caption").text(date.getFullYear() + " "
            + monthNames[date.getMonth()]);
}

function drawAndFillTableBody(date){
    var tbody = createAndFillTbody(date);
        
    $("#calendar-table").append(tbody);
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
    var lastRowEmptyCellNumber = (rowNumber * 7) -
            (firstRowEmptyCellNumber + dayNumber);
    
    var tbodySize = {rowNumber: rowNumber,
        firstRowEmptyCellNumber: firstRowEmptyCellNumber,
        dayNumber: dayNumber,
        lastRowEmptyCellNumber: lastRowEmptyCellNumber
    };
    return tbodySize;
}

function createAndFillCells(tbodySize){
    var tbody = document.createElement("tbody");
    
    var firstRow = createAndFillFirstRow(tbodySize.firstRowEmptyCellNumber);
    tbody.appendChild(firstRow);
    
    var currentDay = 7 - tbodySize.firstRowEmptyCellNumber + 1;
    tbody = createMiddleRowsInTbody(tbody, tbodySize.rowNumber, currentDay);
     
    var firstDayOfLastRow = currentDay + (tbodySize.rowNumber - 2) * 7;
    var lastRow = createAndFillLastRow(firstDayOfLastRow, tbodySize.lastRowEmptyCellNumber);
    tbody.appendChild(lastRow);
    
    return tbody;
}

function createAndFillFirstRow(firstRowEmptyCellNumber){
    var currentDay = 1;
    var firstRow = document.createElement("tr");
    for (var i=0; i<firstRowEmptyCellNumber; ++i){
        var newCell = document.createElement("td");
        firstRow.appendChild(newCell);
    }
    for (var i=firstRowEmptyCellNumber; i<7; ++i){
        var newCell = createDayCell(currentDay);
        firstRow.appendChild(newCell);
        currentDay++;
    }
    return firstRow;
}

function createMiddleRowsInTbody(tbody, rowNumber, currentDay){
    for (var i=1; i<rowNumber - 1; ++i){
        var row = createFullRow(currentDay + (i-1)*7);
        tbody.appendChild(row);
    }
    return tbody;
}

function createFullRow(currentDay){
    var row = document.createElement("tr");
    for (var i = 0; i < 7; i++) {
        var newCell = createDayCell(currentDay);
        row.appendChild(newCell);
        currentDay++;
    }
    return row;
}

function createAndFillLastRow(firstDayOfLastRow, lastRowEmptyCellNumber){
    var lastRow = document.createElement("tr");
    var lastDay = firstDayOfLastRow + (7 - lastRowEmptyCellNumber - 1);
    for (var i=firstDayOfLastRow; i<=lastDay; i++){
        var newCell = createDayCell(i);
        lastRow.appendChild(newCell);
    }
    for (var i=lastDay + 1; i<=lastDay + lastRowEmptyCellNumber; i++){
        var newCell = document.createElement("td");
        lastRow.appendChild(newCell);
    }
    
    return lastRow;
}

function createDayCell(currentDay){
    var newCell = document.createElement("td");
    var dayNumber = document.createTextNode(currentDay);
    var lineBreak = document.createElement("br");
    var extraMinutes = document.createElement("span");
    extraMinutes.style.fontSize = "0.8em";
    var extraMinutesText = document.createTextNode("100");

    extraMinutes.appendChild(extraMinutesText);
    newCell.appendChild(dayNumber);
    newCell.appendChild(lineBreak);
    newCell.appendChild(extraMinutes);
    return newCell;
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