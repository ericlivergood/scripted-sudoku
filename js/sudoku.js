var puzzleRow = function(){
    var self = this;
    self.columns = ko.observableArray();
}

var puzzleCell = function(){
    var self = this;
    self.value = ko.observable();
    self.isPuzzleProvided = ko.observable(false);
    self.isIncorrect = ko.observable(false);
}

var sudoku = function(){
    var self = this;
    self.rows = ko.observableArray();
    self.columns = ko.computed(function(){
        var cols = []
        for(var i = 0; i < 9; i++){
            cols.push([])
            for(var j  = 0; j < 9; j++){
                if(self.rows()[j]){
                    cols[i][j] = self.rows()[j].columns()[i];
                }
            }
        }

        return cols;
    });

    self.regions = ko.computed(function(){
        return [];
    });

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
        for(r in self.rows()){
            self._checkSet(self.rows()[r].columns());
        }

        for(c in self.columns()){
            self._checkSet(self.columns()[c]);
        }

        for(r in self.regions()){
            self._checkSet(self.columns()[r]);
        }

        for(r in self.rows()){
            var row = self.rows()[r];
            for(c in row.columns()){
                var column = row.columns()[r];
                if(column.value()){
                    if(column.isIncorrect){
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
        }
        return true;
    }    

    self._checkSet = function(set){
        var vals = {};
        //create a blank dictionary for all values
        for(var i = 1; i <= 9; i++){
            vals[i] = [];
        }

        //put each set value into the dictionary
        for(s in set){
            if(set[s].value()){
                vals[parseInt(set[s].value())].push(set[s]);
            }
        }

        //check that each value in the dictionary only has one entry
        //otherwise those values from the set are wrong.
        for(x in vals){
            var incorrect = false;
            if(vals[x].length > 1){
                incorrect = true;
            }
            for(v in vals[x]){
                vals[x][v].isIncorrect(incorrect);
            }
        }        
    }

    self.resetPuzzle = function() {
        ko.utils.arrayForEach(self.rows(), function(row){
            ko.utils.arrayForEach(row.columns(), function(col){
                if(!col.isPuzzleProvided()){
                    col.value(null);
                }
                col.isIncorrect(false); 
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
