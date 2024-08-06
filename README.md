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

### Example

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
