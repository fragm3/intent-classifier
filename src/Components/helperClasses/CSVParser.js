class CSVParser{
    constructor(){
        this.config = {};
        this.data = [];
    }

    parse = (input, config) => {
        if (config === void 0) { config = {}; }
        this.load_config(config);
        var lines = input.split('\n');
        var start = this.config['header'] ? 1 : 0;
        var end = lines.length;
        return this.transform(lines, start, end);
    };

    isFunction = func => {
        return typeof func === 'function';
    };

    load_config = config => {
        this.config['header'] = config.header || true;
        this.config['delimiter'] = config.delimiter || ',';
    };

    transform = (lines, start, end) => {
        for (var i = start; i < end; i++) {
            var line = lines[i].trim();
            if (line) {
            this.data.push(line.split(this.config['delimiter']));
        }
        }
        return this.data;
    };
}

export default CSVParser;