var puzzleRow = function(){
    var self = this;
    self.columns = ko.observableArray();
}

var puzzleCell = function(x,y){
    var self = this;
    self.value = ko.observable();
    self.isPuzzleProvided = ko.observable(false);
    self.isIncorrect = ko.observable(false);
    self.x = x;
    self.y = y;
    self.region = function(){
        return (x%3) + Math.floor(y/3)*3;
    }
}

var sudoku = function(){
    var self = this;
    self.cells = ko.observableArray();

    self._blankPuzzle = function(){
        var blankCells = []

        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                var cell = new puzzleCell(i, j);
                blankCells.push(cell);
            }
        }       
        self.cells(blankCells);
    }
    self._blankPuzzle();

    self._findCell = function(x,y){
        for(var i = 0; i < self.cells().length; i++){
            if(self.cells()[i].x == x && self.cells()[i].y == y){
                return self.cells()[i];
            }
        }
    }

    self.rows = ko.computed(function(){
        rows = []
        for(var x = 0; x < 9; x++){
            rows.push({columns:[]})
            for(var y = 0; y < 9; y++){
                rows[x].columns.push(self._findCell(x,y));
            }
        }
        return rows;
    });

    self.columns = ko.computed(function(){
        var cols = []
        for(var y = 0; y < 9; y++){
            cols.push({rows:[]})
            for(var x = 0; x < 9; x++){
                cols[y].rows.push(self._findCell(x,y));
            }
        }
        return cols;
    });

    self.regions = ko.computed(function(){
        return [];
    });

    self.createPuzzle = function(){
        self._blankPuzzle();

        var tries = 10;
        var totalTries = 0;

        var rand = function() { return Math.floor(Math.random()*100)%9; }
        var setCells = [];

        while(setCells.length < 81 && totalTries < 100){
            var randomCell = self._findCell(rand(), rand());

            if(!randomCell.value()){
                //assign a random value
                randomCell.value(rand()+1);
                //check the puzzle
                self.checkPuzzle();

                //if the new cell caused a problem, unset it
                if(randomCell.isIncorrect()){
                    randomCell.value(null);

                    tries--;
                    if(tries <= 0){
                        if(setCells.length > 0){
                            setCells.pop().value(null);
                        }
                        tries = 10;
                    }
                }
                else{
                    setCells.push(randomCell);
                    tries = 10;
                }
                totalTries++;
            }

        }
    }

    self.checkPuzzle = function() {
        self._resetCorrectness();
        for(r in self.rows()){
                self._checkSet(self.rows()[r].columns);
        }

        for(c in self.columns()){
            self._checkSet(self.columns[c]);
        }

        for(r in self.regions()){
            self._checkSet(self.columns[r]);
        }

        for(var c in self.cells()){
            var cell = self.cells[c];
            if(cell){
                if(cell.value()){
                    if(cell.isIncorrect()){
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
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
            if(set[s]){
                if(set[s].value()){
                    vals[parseInt(set[s].value())].push(set[s]);
                }
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
                //if the value isn't currently set as incorrect, set it how we found it in this check.
                if(!vals[x][v].isIncorrect()){
                    vals[x][v].isIncorrect(incorrect);
                }
            }
        }        
    }

    self.resetPuzzle = function() {
        ko.utils.arrayForEach(self.rows(), function(row){
            ko.utils.arrayForEach(row.columns(), function(col){
                if(!col.isPuzzleProvided()){
                    col.value(null);
                }
            });
        });
        self._resetCorrectness();
    }

    self._resetCorrectness = function(){
        ko.utils.arrayForEach(self.cells(), function(cell){
                cell.isIncorrect(false); 
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

var staticBase = [
  [1,2,3,4,5,6,7,8,9]
, [4,5,6,7,8,9,1,2,3]
, [7,8,9,1,2,3,4,5,6]
, [2,3,4,5,6,7,8,9,1]
, [5,6,7,8,9,1,2,3,4]
, [8,9,1,2,3,4,5,6,7]
, [3,4,5,6,7,8,9,1,2]
, [6,7,8,9,1,2,3,4,5]
, [9,1,2,3,4,5,6,7,8]
]
