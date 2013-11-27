var puzzleRow = function(){
    var self = this;
    self.columns = ko.observableArray();
}

var puzzleCell = function(){
    var self = this;
    self.value = ko.observable();
    self.isPuzzleProvided = ko.observable(false);
}

var sudoku = function(){
    var self = this;
    self.rows = ko.observableArray();

    self.createPuzzle = function(){
        self.rows.removeAll();
        for(var i = 0; i < 9; i++){
            self.rows.push(new puzzleRow());
            for(var j = 0; j < 9; j++){
                var cell = new puzzleCell();

                if(staticPuzzle[i][j]){
                    cell.value(staticPuzzle[i][j]);
                    cell.isPuzzleProvided(true);
                }
                self.rows()[i].columns.push(cell);
            }
        }
    }

    self.checkPuzzle = function() {
    }    
    self.resetPuzzle = function() {
        ko.utils.arrayForEach(self.rows(), function(row){
            ko.utils.arrayForEach(row.columns(), function(col){
                if(!col.isPuzzleProvided()){
                    col.value(null);
                }
            });
        });
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
