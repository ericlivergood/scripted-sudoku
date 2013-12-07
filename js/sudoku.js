var puzzleCell = function(x,y){
    var self = this;
    self.value = ko.observable();
    self.isPuzzleProvided = ko.observable(false);
    self.isIncorrect = ko.observable(false);
    self.x = x;
    self.y = y;
    self.region = function(){
        return Math.floor(x/3) + Math.floor(y/3)*3;
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
        var regions = []

        for(var r = 0; r < 9; r++){
            regions.push({cells:[]});
        }
        ko.utils.arrayForEach(self.cells(), function(c){
            regions[c.region()].cells.push(c);
        });

        return regions;
    });

    self.createPuzzle = function(){
        var newPuzzle = [];
        for(var i = 0; i < 9; i++)
        {
            newPuzzle.push([]);
            for(var j = 0; j < 9; j++){
                newPuzzle[i][j] = staticBase[i][j];
            }
        }

        
        for(var i = 0; i < 100000; i++){
            var operation = Math.floor(Math.random()*100)%4;
            var grp = Math.floor(Math.random()*100)%3;
            var r1 = Math.floor(Math.random()*100)%3;  
            var r2 = Math.floor(Math.random()*100)%3;               

            switch(operation){
                case 0:
                    self._swapRows(newPuzzle, grp*3+r1, grp*3+r2);
                    break;
                case 1:            
                    self._swapColumns(newPuzzle, grp*3+r1, grp*3+r2);
                    break;
                case 2:       
                    self._swapColumnRegions(newPuzzle, r1, r2);
                    break;
                case 3:                 
                    self._swapRowRegions(newPuzzle, r1, r2);
                    break;
            }
        }

        var numToRemove = Math.floor(Math.random()*30)+ 20

        for(var i = 0; i < numToRemove; ){
            var x = Math.floor(Math.random()*100)%9;  
            var y = Math.floor(Math.random()*100)%9;     

            if(newPuzzle[x][y]){
                newPuzzle[x][y] = null;
                i++;
            }       
        }


        self._setPuzzle(newPuzzle);
    }

    self._setPuzzle = function(puzzleArray){
        self._blankPuzzle();
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                var c = self._findCell(j,i);
                c.value(puzzleArray[i][j]);
                if(c.value()){
                    c.isPuzzleProvided(true);
                    c.isIncorrect(false);
                }
            }
        }
    }

    self._swapRows = function(puzzleArray,i,j){
        var tmp = puzzleArray[i];
        puzzleArray[i] = puzzleArray[j];
        puzzleArray[j] = tmp;
    }
    self._swapColumns = function(puzzleArray,i,j){
        var tmp;
        for(var x = 0; x < 9; x++){
            tmp = puzzleArray[x][i];
            puzzleArray[x][i] = puzzleArray[x][j];
            puzzleArray[x][j] = tmp;
        }
    }
    self._swapRowRegions = function(puzzleArray,i,j){
        self._swapRows(puzzleArray, i*3, j*3);
        self._swapRows(puzzleArray, i*3+1, j*3+1);
        self._swapRows(puzzleArray, i*3+2, j*3+2);
    }
    self._swapColumnRegions = function(puzzleArray,i,j){
        self._swapColumns(puzzleArray, i*3, j*3);
        self._swapColumns(puzzleArray, i*3+1, j*3+1);
        self._swapColumns(puzzleArray, i*3+2, j*3+2);
    }


    self.checkPuzzle = function() {
        self._resetCorrectness();
        var rows = self.rows();
        for(r in rows){
            self._checkSet(rows[r].columns);
        }

        var cols = self.columns();
        for(c in cols){
            self._checkSet(cols[c].rows);
        }

        var regions = self.regions();
        for(r in regions){
            self._checkSet(regions[r].cells);
        }

        for(var c in self.cells()){
            var cell = self.cells()[c];
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
        ko.utils.arrayForEach(self.cells(), function(cell){
            if(!cell.isPuzzleProvided()){
                cell.value(null);
            }
        });
        self._resetCorrectness();
    }

    self._resetCorrectness = function(){
        ko.utils.arrayForEach(self.cells(), function(cell){
                cell.isIncorrect(false); 
        });
    }
}

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
