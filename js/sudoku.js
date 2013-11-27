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
                self.rows()[i].columns.push(j)
            }
        }
    }
}
