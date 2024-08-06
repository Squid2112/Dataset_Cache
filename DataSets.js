var DataSet = (function() {
	function DataSet(left, right) {
		this.left = null;
		this.right = null;

		if(arguments.length === 2) {
			if(left <= right) {
				this.left = left;
				this.right = right;
			} else {
				this.left = right;
				this.right = left;
			}
		}
	}

	DataSet.prototype._left = function(l) {
		if(arguments.length) {
			if(l > this.right) {
				throw new Error("ERROR: Left must be less than or equal to Right.");
			}

			this.left = l;
		}
		
		return this.left;
	};

	DataSet.prototype._right = function(r) {
		if(arguments.length) {
			if(r < this.left) {
				throw new Error("ERROR: Right must be greater than or equal to Left.");
			}
			this.right = r;
		}

		return this.right;
	};

	DataSet.prototype.equal = function(s) {
		return ((s.left === this.left) && (s.right === this.right));
	};

	DataSet.prototype.chunk = function(size) {
		var result = [];

		while(Math.abs(this.left - this.right) > size) {
			var chunk = new DataSet(this.left, this.left + size - 1);
			this.left += (size);
			result.push(chunk);
		}
		result.push(this);

		return result;
	};

	DataSet.prototype.toString = function() {
		return (this.left + ":" + this.right);
	};


	return DataSet;
})();


var DataSets = (function() {
	function DataSets(dataSet) {
		this.dataSets = [];

		if(dataSet !== undefined) {
			this.dataSets.push(dataSet);
		}
	}

	DataSets.prototype.sets = function(dataSet) {
		if(dataSet !== undefined) {
			this.dataSets.push(dataSet);
		}

		return this.dataSets;
	};

	DataSets.prototype.addSet = function(dataSet, justCheck) {
		justCheck = ((arguments.length === 2) ? true : false);

		if(dataSet.left > dataSet.right) {
			var tmp = dataSet.left;
			dataSet.left = dataSet.right;
			dataSet.right = tmp;
		}

		if(this.dataSets.length === 0) {
			this.dataSets.push(new DataSet(dataSet.left, dataSet.right));
			return dataSet;
		}

		for(var x = 0; x < this.dataSets.length; x++) {
			// set is within (inside) of this.dataSets[x]
			if((dataSet.left >= this.dataSets[x].left) && (dataSet.right <= this.dataSets[x].right)) {
				return null;
			}

			// set is overlapping to the right of this.dataSets[x]
			if((dataSet.left >= this.dataSets[x].left) && (dataSet.right >= this.dataSets[x].right) && (dataSet.left <= this.dataSets[x].right)) {
				var tLeft = this.dataSets[x].right;
				if(!justCheck) {
					this.dataSets[x].right = dataSet.right;
				}
				return new DataSet(tLeft, dataSet.right);
			}

			// set is overlapping to the left of this.dataSets[x]
			if((dataSet.left <= this.dataSets[x].left) && (dataSet.right >= this.dataSets[x].left) && (dataSet.right <= this.dataSets[x].right)) {
				var tRight = this.dataSets[x].left;
				if(!justCheck) {
					this.dataSets[x].left = dataSet.left;
				}
				return new DataSet(dataSet.left, tRight);
			}

			// set is bigger than this.dataSets[x], must return 2 new sets and expand this.dataSets[x]
			if(((dataSet.left < this.dataSets[x].left) && (dataSet.right >= this.dataSets[x].right)) || ((dataSet.left <= this.dataSets[x].left) && (dataSet.right > this.dataSets[x].right))) {
				var tRight = this.dataSets[x].left;
				var tLeft = this.dataSets[x].right;
				if(!justCheck) {
					this.dataSets[x].left = dataSet.left;
					this.dataSets[x].right = dataSet.right;
				}
				return [new DataSet(dataSet.left, tRight), new DataSet(tLeft, dataSet.right)];
			}
		}

		if(!justCheck) {
			this.dataSets.push(new DataSet(dataSet.left, dataSet.right));
		}

		return dataSet;
	};

	DataSets.prototype.equal = function(dataSet) {
		return (this.left === dataSet.left) && (this.right === dataSet.right);
	};

	DataSets.prototype.whatWouldBeAdded = function(dataSet) {
		return this.addSet(dataSet, true);
	};
	
	DataSets.prototype.wouldBeAdded = function(dataSet) {
		return (this.addSet(dataSet, true) !== null);
	};

	return DataSets;
})();