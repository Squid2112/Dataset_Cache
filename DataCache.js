var ACCUMULATION = { "CUMULATIVE": "Cumulative", "INTERVAL" : "Interval" };

var DataCache = (function() {
	function DataCache(accumulationType) {
		this.data = [];
		this.rawData = {};
		this.dataSets = new DataSets();
		this.accumulationType = (arguments.length > 0) ? accumulationType : "Interval";
	}

	DataCache.prototype.inCache = function(dataSet) {
		var tmpSet = this.dataSets.whatWouldBeAdded(dataSet);
		return (tmpSet === null);
	};

	DataCache.prototype.addSet = function(dataSet) {
		return this.dataSets.addSet(dataSet);
	};

	DataCache.prototype.addData = function(d) {
		this.data = this.data.concat(d);
		this.data = this.data.unique();
	};

	DataCache.prototype.addLogData = function(logData) {
		var tmpData = {};
		var tmpKeys = Object.keys(logData);
		
		if(tmpKeys.length === 0) {
			return;
		}

		this.data = [];
		
		tmpKeys.sort(function(a, b) {
			if(parseInt(a) < parseInt(b)) return -1;
			if(parseInt(a) > parseInt(b)) return 1;
			return 0;
		});

		for(var x=0; x<tmpKeys.length; x++) {
			var value = parseFloat(logData[tmpKeys[x]]);

			if(!isNaN(value)) {
				tmpData[tmpKeys[x]] = value;
			} else {
				tmpData[tmpKeys[x]] = null;
			}
			this.rawData[tmpKeys[x]] = tmpData[tmpKeys[x]];
		}

		var keys = Object.keys(this.rawData);
		keys.sort(function(a, b) {
			if(parseInt(a) < parseInt(b)) return -1;
			if(parseInt(a) > parseInt(b)) return 1;
			return 0;
		});

		var priorValue = parseFloat(null);
		for(var x = 0; x < keys.length; x++) {
			var value = parseFloat(this.rawData[keys[x]]);

			if(this.accumulationType === ACCUMULATION.CUMULATIVE) {
				if(!isNaN(priorValue) && !isNaN(value)) {
					this.data.push([keys[x], (value - priorValue)]);
				} else if(!(isNaN(priorValue) && isNaN(value))) {	// don't bother creating a whole bunch of consecutive null records
					this.data.push([keys[x], null]);
				}
			} else if(!(isNaN(priorValue) && isNaN(value))) {	// don't bother creating a whole bunch of consecutive null records
				this.data.push([keys[x], value]);
			}

			priorValue = value;
		}
		
		if(tmpKeys.length > 0) {
			this.data.sort(function(a, b) {
				if(a[0] < b[0]) return -1;
				if(a[0] > b[0]) return 1;
				return 0;
			});
		}
	};

	DataCache.prototype.empty = function() {
		this.data = [];
		this.rawData = {};
		this.dataSets = new DataSets();
	};

	return DataCache;
})();