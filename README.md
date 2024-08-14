# Data Cache System for Streaming Time Series Energy Data

This project provides a robust JavaScript-based system for creating datasets and caching data, specifically designed to handle large chunks of time series energy data efficiently. The system consists of two main components: `DataSets` and `DataCache`.

## Architecture Overview

### DataSets

The `DataSets` module is designed to manage ranges of data points, represented as datasets. Each dataset covers a specific range and can be manipulated and queried to determine overlaps and additions.

#### Key Components

- **DataSet Class**: Represents a range of data points with a left (start) and right (end) boundary.
  - **Constructor**: Accepts two arguments to set the left and right boundaries.
  - **Methods**:
    - `_left(l)`: Sets or retrieves the left boundary, ensuring it is less than or equal to the right boundary.
    - `_right(r)`: Sets or retrieves the right boundary, ensuring it is greater than or equal to the left boundary.
    - `equal(s)`: Checks if another dataset has the same boundaries.
    - `chunk(size)`: Splits the dataset into smaller chunks of a specified size.
    - `toString()`: Converts the dataset boundaries to a string representation.

- **DataSets Class**: Manages a collection of `DataSet` instances.
  - **Constructor**: Initializes an empty collection or accepts an initial dataset to include.
  - **Methods**:
    - `sets(dataSet)`: Adds a dataset to the collection.
    - `addSet(dataSet, justCheck)`: Adds a dataset to the collection, checking for overlaps and adjusting boundaries as necessary.
    - `equal(dataSet)`: Checks if the collection contains a dataset with the same boundaries.
    - `whatWouldBeAdded(dataSet)`: Determines what would be added to the collection without actually adding it.
    - `wouldBeAdded(dataSet)`: Checks if a dataset would be added to the collection without actually adding it.

### DataCache

The `DataCache` module is designed to store and manage time series data efficiently. It allows for the addition of new data, handles cumulative and interval data accumulation, and ensures data integrity through unique and sorted datasets.

#### Key Components

- **ACCUMULATION Enum**: Defines the types of data accumulation: `CUMULATIVE` and `INTERVAL`.

- **DataCache Class**: Manages the cached data and integrates with the `DataSets` module.
  - **Constructor**: Initializes the cache with a specified accumulation type (default is `INTERVAL`).
  - **Methods**:
    - `inCache(dataSet)`: Checks if a dataset is already in the cache.
    - `addSet(dataSet)`: Adds a dataset to the cache.
    - `addData(d)`: Adds raw data to the cache, ensuring uniqueness.
    - `addLogData(logData)`: Adds and processes log data, sorting and accumulating values based on the specified accumulation type.
    - `empty()`: Clears the cache, resetting all data and datasets.

## Usage

### Example 1 : Basica Data Caching
This example demonstrates how to create a DataCache instance, add a dataset, and manage time series data with cumulative accumulation.

```javascript
// Create a new DataCache instance with cumulative accumulation
var cache = new DataCache(ACCUMULATION.CUMULATIVE);

// Add a dataset
cache.addSet(new DataSet(0, 100));

// Add raw data
cache.addData([1, 2, 3, 4, 5]);

// Add log data
cache.addLogData({
  '1627898400000': 100,
  '1627898460000': 150,
  '1627898520000': 200
});

// Check if a dataset is in the cache
console.log(cache.inCache(new DataSet(0, 100))); // Output: true

// Empty the cache
cache.empty();
```


### Example 2 : Interval Data Caching
This example shows how to use the DataCache with interval-based accumulation, which is useful when dealing with discrete time intervals.

```javascript
// Create a new DataCache instance with interval accumulation
var cache = new DataCache(ACCUMULATION.INTERVAL);

// Add multiple datasets
cache.addSet(new DataSet(0, 50));
cache.addSet(new DataSet(51, 100));

// Add raw data for each interval
cache.addData([10, 20, 30, 40, 50]);
cache.addData([60, 70, 80, 90, 100]);

// Add log data for specific time intervals
cache.addLogData({
  '1627898400000': 500,
  '1627898460000': 600,
  '1627898520000': 700
});

// Check if specific intervals are in the cache
console.log(cache.inCache(new DataSet(0, 50)));  // Output: true
console.log(cache.inCache(new DataSet(51, 100))); // Output: true
```

### Example 3: Advanced Dataset Manipulation
In this example, we demonstrate how to split a dataset into smaller chunks and work with overlapping datasets.

```javascript
// Create a new DataSets instance
var dataSets = new DataSets();

// Define a large dataset
var largeSet = new DataSet(0, 1000);

// Add the large dataset to the collection
dataSets.addSet(largeSet);

// Split the dataset into smaller chunks of size 100
var chunks = largeSet.chunk(100);

// Add each chunk to the DataSets collection
chunks.forEach(function(chunk) {
    dataSets.addSet(chunk);
});

// Check for overlapping datasets
var overlapCheck = new DataSet(50, 150);
console.log(dataSets.wouldBeAdded(overlapCheck));  // Output: true

// Inspect the datasets
console.log(dataSets);
```

### Example 4: Combining Datasets with Caching
This example combines the use of DataSets and DataCache to handle complex scenarios involving multiple overlapping datasets.

```javascript
// Create a new DataCache instance
var cache = new DataCache(ACCUMULATION.CUMULATIVE);

// Define and add multiple datasets
cache.addSet(new DataSet(0, 50));
cache.addSet(new DataSet(60, 120));

// Add log data associated with these datasets
cache.addLogData({
  '1627898400000': 300,
  '1627898460000': 400,
  '1627898520000': 500
});

// Check if a new overlapping dataset would be added
var newSet = new DataSet(30, 70);
console.log(cache.inCache(newSet)); // Output: true or false based on overlap handling

// Process and inspect the data
console.log(cache);
```
