var puzzleRow = function(){
    var self = this;
    self.columns = ko.observableArray();
}
var sudoku = function(){
    var self = this;
    self.rows = ko.observableArray();

    self.createPuzzle = function(){
        self.rows.removeAll();
        for(var i = 0; i < 9; i++){
            self.rows.push(new puzzleRow());
            for(var j = 0; j < 9; j++){
                self.rows()[i].columns.push(staticPuzzle[i][j])
            }
        }
    }
}

var staticPuzzle = [
  [6, ,3, , ,5, ,9,4]
, [7,4, , , , , , , ]
, [ ,8,9, ,7,1, , ,2]
, [ ,5, ,3,1, , , , ]
, [1,3, ,8, ,4, ,2,6]
, [ , , , ,2,7, ,3, ]
, [8, , ,7,5, ,4,1, ]
, [ , , , , , , ,5,9]
, [3,2, ,1, , ,6, ,8]
]
