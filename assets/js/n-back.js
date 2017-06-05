// n-back.js

var config = {
    'blank_stimulus': '×',
    'stimuli_pool': ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    'total_size': 48,
    'target_size': 16,
    'tick_interval': 500,
    'tock_interval': 2000,
    'baseline_interval': 120000,
    'granularity': 500,
    'levels': [0, 1, 2]
};

function generateBlock(level,
    stimuliPool=config.stimuli_pool,
    totalSize=config.total_size,
    targetSize=config.target_size,
    tickInterval=config.tick_interval,
    tockInterval=config.tock_interval) {
    var stimuli = [];
    var interval = tickInterval + tockInterval;
    var tick = 0;
    var tock = tickInterval;
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

function generateBlocks(levels=config.levels,
    stimuliPool=config.stimuli_pool,
    totalSize=config.total_size,
    targetSize=config.target_size,
    tickInterval=config.tick_interval,
    tockInterval=config.tock_interval) {
    return _.map(shuffleBlocks(levels), function (level) {
        return generateBlock(level, stimuliPool, totalSize, targetSize, tickInterval, tockInterval);
    });
};

function loadStimulus(stimulus) {
    $('#stimulus-wrapper').html('<div class="ui header">' + stimulus + '</div>');
};

function resetStimulus() {
    $('#stimulus-wrapper').html('<div class="ui header disabled">' + config.blank_stimulus + '</div>');
};

function loadCountdown(second) {
    $('#block-loading-progress').progress('increment');
    $('#stimulus-wrapper .ui.header').text(second + 's');
};

function loadRestBlock(restInvertal=config.baseline_interval) {};

function loadBlock(block) {
    $('#task-header .image').attr({
        src: block.image_src,
        alt: block.image_alt
    });
    $('#task-header .content').text(block.header);
    $('#action-buttons').html('<div class="ui two large buttons"><div class="ui positive left labeled icon target button"><i class="checkmark icon"></i>Target</div><div class="ui negative right labeled icon non-target button">Non-Target<i class="remove icon"></i></div></div>');
    var elapsedTime = 0;
    var stimulusIndex = 0;
    loadStimulus(block.stimuli[stimulusIndex].stimulus);
    var intervalID = setInterval(function () {
        // if (elapsedTime < config.baseline_interval) {
        //     loadCountdown(Math.floor((config.baseline_interval - elapsedTime) / config.granularity / 2));
        // } else if (elapsedTime === config.baseline_interval) {
            // $('#action-buttons').html('<div class="ui two large buttons"><div class="ui positive left labeled icon target button"><i class="checkmark icon"></i>Target</div><div class="ui negative right labeled icon non-target button">Non-Target<i class="remove icon"></i></div></div>');
        // };
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
    }, config.granularity);
};