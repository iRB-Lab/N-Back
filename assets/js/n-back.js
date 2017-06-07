// n-back.js

var taskOptions = {
    'empty_stimulus': '×',
    'stimuli_pool': ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    'total_size': 48,
    'target_size': 16,
    'before_start': 100,
    'load_interval': 100,
    'unload_interval': 100,
    'granularity': 100,
    'levels': [0, 1, 2],
    'rsme': {
        '2': 'Absolutely no effort',
        '13': 'Almost no effort',
        '25': 'A little effort',
        '37': 'Some effort',
        '57': 'Rather much effort',
        '71': 'Considerable effort',
        '85': 'Great effort',
        '102': 'Very great effort',
        '112': 'Extreme effort'
    }
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
                'unload_time': unloadTime,
                'answer': null,
                'correct': null,
                'response_time': null
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
                    'unload_time': unloadTime,
                    'answer': null,
                    'correct': null,
                    'response_time': null
                });
            } else {
                var target = _.nth(stimuli, -level).stimulus;
                if (_.random(1, totalSize - i) <= targetSize) {
                    targetSize--;
                    stimuli.push({
                        'stimulus': target,
                        'is_target': true,
                        'load_time': loadTime,
                        'unload_time': unloadTime,
                        'answer': null,
                        'correct': null,
                        'response_time': null
                    });
                } else {
                    stimuli.push({
                        'stimulus': _.sample(_.difference(stimuliPool, [target])),
                        'is_target': false,
                        'load_time': loadTime,
                        'unload_time': unloadTime,
                        'answer': null,
                        'correct': null,
                        'response_time': null
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
        'total_time': loadTime,
        'rsme': null
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