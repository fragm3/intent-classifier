var CSVParser = /** @class */ (function () {
  function CSVParser() {
    this.config = {};
    this.data = [];
  }
  CSVParser.prototype.parse = function (input, config) {
    if (config === void 0) { config = {}; }
    this.load_config(config);
    var lines = input.split('\n');
    var start = this.config['header'] ? 1 : 0;
    var end = lines.length;
    return this.transform(lines, start, end);
  };
  CSVParser.prototype.isFunction = function (func) {
    return typeof func === 'function';
  };
  CSVParser.prototype.load_config = function (config) {
    this.config['header'] = config.header || true;
    this.config['delimiter'] = config.delimiter || ',';
  };
  CSVParser.prototype.transform = function (lines, start, end) {
    for (var i = start; i < end; i++) {
      var line = lines[i].trim();
      if (line) {
        this.data.push(line.split(this.config['delimiter']));
      }
    }
    return this.data;
  };
  return CSVParser;
}());

export default CSVParser;