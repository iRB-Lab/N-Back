// n-back.js

var taskOptions = {
    'empty_stimulus': '×',
    'stimuli_pool': ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    'total_size': 48,
    'target_size': 16,
    'before_start': 2000,
    'load_interval': 500,
    'unload_interval': 2000,
    'baseline_interval': 120000,
    'granularity': 100,
    'levels': [0, 1, 2]
};

function generateBlock(level,
    stimuliPool=taskOptions.stimuli_pool,
    totalSize=taskOptions.total_size,
    targetSize=taskOptions.target_size,
    beforeStart=taskOptions.before_start,
    loadInterval=taskOptions.load_interval,
    unloadInterval=taskOptions.unload_interval) {
    var stimuli = [];
    var interval = loadInterval + unloadInterval;
    var loadTime = beforeStart;
    var unloadTime = loadTime + loadInterval;
    if (level === 0) {
        for (var i = 0; i < totalSize; i++) {
            stimuli.push({
                'stimulus': _.sample(stimuliPool),
                'is_target': true,
                'load_time': loadTime,
                'unload_time': unloadTime
            });
            loadTime += interval;
            unloadTime += interval;
        };
    } else if (level > 0) {
        for (var i = 0; i < totalSize; i++) {
            if (i < level) {
                stimuli.push({
                    'stimulus': _.sample(stimuliPool),
                    'is_target': false,
                    'load_time': loadTime,
                    'unload_time': unloadTime
                });
            } else {
                var target = _.nth(stimuli, -level).stimulus;
                if (_.random(1, totalSize - i) <= targetSize) {
                    targetSize--;
                    stimuli.push({
                        'stimulus': target,
                        'is_target': true,
                        'load_time': loadTime,
                        'unload_time': unloadTime
                    });
                } else {
                    stimuli.push({
                        'stimulus': _.sample(_.difference(stimuliPool, [target])),
                        'is_target': false,
                        'load_time': loadTime,
                        'unload_time': unloadTime
                    });
                };
            };
            loadTime += interval;
            unloadTime += interval;
        };
    };
    return {
        'level': level,
        'header': 'The ' + String(level) + '-Back Task',
        'image_src': '/images/logo-' + String(level) + '.png',
        'image_alt': String(level) + '-Back Task Logo',
        'stimuli': stimuli,
        'end_time': loadTime
    };
};

function shuffleBlocks(levels=taskOptions.levels) {
    var blocks = _.sampleSize(levels, 2);
    return _.concat(_.shuffle(_.difference(levels, [blocks[0]])), blocks, _.shuffle(_.difference(levels, [blocks[1]])));
};

function generateBlocks(levels=taskOptions.levels,
    stimuliPool=taskOptions.stimuli_pool,
    totalSize=taskOptions.total_size,
    targetSize=taskOptions.target_size,
    beforeStart=taskOptions.before_start,
    loadInterval=taskOptions.load_interval,
    unloadInterval=taskOptions.unload_interval) {
    return _.map(shuffleBlocks(levels), function (level) {
        return generateBlock(level, stimuliPool, totalSize, targetSize, beforeStart, loadInterval, unloadInterval);
    });
};