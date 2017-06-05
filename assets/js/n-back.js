// n-back.js

var config = {
    'blank_stimulus': '×',
    'stimuli_pool': ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    'total_size': 48,
    'target_size': 16,
    'tick_interval': 500,
    'tock_interval': 2000,
    'baseline_interval': 1000,
    'granularity': 500,
    'levels': [0, 1, 2]
};

function getBlock(level,
    stimuliPool=config.stimuli_pool,
    totalSize=config.total_size,
    targetSize=config.target_size,
    tickInterval=config.tick_interval,
    tockInterval=config.tock_interval,
    restInterval=config.baseline_interval) {
    var stimuli = [];
    var interval = tickInterval + tockInterval;
    var tick = restInterval;
    var tock = restInterval + tickInterval;
    if (level === 0) {
        for (var i = 0; i < totalSize; i++) {
            stimuli.push({
                'stimulus': _.sample(stimuliPool),
                'is_target': true,
                'tick': tick,
                'tock': tock
            });
            tick += interval;
            tock += interval;
        };
    } else if (level > 0) {
        for (var i = 0; i < totalSize; i++) {
            if (i < level) {
                stimuli.push({
                    'stimulus': _.sample(stimuliPool),
                    'is_target': false,
                    'tick': tick,
                    'tock': tock
                });
            } else {
                var target = _.nth(stimuli, -level).stimulus;
                if (_.random(1, totalSize - i) <= targetSize) {
                    targetSize--;
                    stimuli.push({
                        'stimulus': target,
                        'is_target': true,
                        'tick': tick,
                        'tock': tock
                    });
                } else {
                    stimuli.push({
                        'stimulus': _.sample(_.difference(stimuliPool, [target])),
                        'is_target': false,
                        'tick': tick,
                        'tock': tock
                    });
                };
            };
            tick += interval;
            tock += interval;
        };
    };
    return {
        'level': level,
        'header': 'The ' + String(level) + '-Back Task',
        'image_src': '/images/logo-' + String(level) + '.png',
        'image_alt': String(level) + '-Back Task Logo',
        'stimuli': stimuli,
        'end_time': tick
    };
};

function shuffleBlocks(levels=config.levels) {
    var blocks = _.sampleSize(levels, 2);
    return _.concat(_.shuffle(_.difference(levels, [blocks[0]])), blocks, _.shuffle(_.difference(levels, [blocks[1]])));
};

function getBlocks(levels=config.levels,
    stimuliPool=config.stimuli_pool,
    totalSize=config.total_size,
    targetSize=config.target_size,
    tickInterval=config.tick_interval,
    tockInterval=config.tock_interval,
    restInterval=config.baseline_interval) {
    return _.map(shuffleBlocks(levels), function (level) {
        return getBlock(level, stimuliPool, totalSize, targetSize, tickInterval, tockInterval, restInterval);
    });
};

function loadStimulus(stimulus) {
    $('#stimulus-wrapper').html('<div class="ui header">' + stimulus + '</div>');
};

function resetStimulus() {
    $('#stimulus-wrapper').html('<div class="ui header disabled">' + config.blank_stimulus + '</div>');
};

function loadBlock(block) {
    $('#task-header .image').attr({
        src: block.image_src,
        alt: block.image_alt
    });
    $('#task-header .content').text(block.header);
    var elapsedTime = 0;
    var stimulusIndex = 0;
    var intervalID = setInterval(function () {
        elapsedTime += config.granularity;
        if (stimulusIndex < block.stimuli.length) {
            if (elapsedTime === block.stimuli[stimulusIndex].tick) {
                loadStimulus(block.stimuli[stimulusIndex].stimulus);
            };
            if (elapsedTime === block.stimuli[stimulusIndex].tock) {
                resetStimulus();
                stimulusIndex++;
            };
        } else if (elapsedTime === block.end_time) {
            clearInterval(intervalID);
        };
        console.log(elapsedTime);
        console.log(stimulusIndex);
        console.log(block.end_time);
    }, config.granularity);
};