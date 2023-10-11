// n-back.js

var taskOptions = {
    'empty_stimulus': '╳',
    'stimuli_pool': ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    'total_size': 48,
    'target_size': 16,
    'rest_interval': 300000,
    'before_start': 2000,
    'load_interval': 500,
    'unload_interval': 2000,
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
                'response_time': null,
                'timestamp': {
                    'load': null,
                    'response': null
                }
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
                    'response_time': null,
                    'timestamp': {
                        'load': null,
                        'response': null
                    }
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
                        'response_time': null,
                        'timestamp': {
                            'load': null,
                            'response': null
                        }
                    });
                } else {
                    stimuli.push({
                        'stimulus': _.sample(_.difference(stimuliPool, [target])),
                        'is_target': false,
                        'load_time': loadTime,
                        'unload_time': unloadTime,
                        'answer': null,
                        'correct': null,
                        'response_time': null,
                        'timestamp': {
                            'load': null,
                            'response': null
                        }
                    });
                };
            };
            loadTime += interval;
            unloadTime += interval;
        };
    };
    return {
        'level': level,
        'level_alias': String(level) + '-Back',
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

function generateTaskBlocks(levels=taskOptions.levels,
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

function generatePracticeBlocks(levels=taskOptions.levels,
    stimuliPool=taskOptions.stimuli_pool,
    totalSize=taskOptions.total_size,
    targetSize=taskOptions.target_size,
    beforeStart=taskOptions.before_start,
    loadInterval=taskOptions.load_interval,
    unloadInterval=taskOptions.unload_interval) {
    return _.map(levels, function (level) {
        return generateBlock(level, stimuliPool, totalSize, targetSize, beforeStart, loadInterval, unloadInterval);
    });
};


// running
var restBlockStartTime = null;
var elapsedTime = 0;
var currentBlockIndex = 0;
var currentBlockLoaded = false;
var currentBlockRunning = false;
var currentStimulusIndex = 0;
var currentStimulusIndexCache = -1;
var currentStimulusLoadTime = new Date();


function tick() {
    elapsedTime += taskOptions.granularity;
};

function loadCurrentBlock(block) {
    currentBlockLoaded = true;
    $('#stimulus').remove();
    $('#task-header .image').attr({
        src: block.image_src,
        alt: block.image_alt
    });
    var subheader = 'Block ' + String(currentBlockIndex + 1) + ' of ' + String(blocks.length);
    $('#task-header .content').html(block.header + '<div class="sub header">' + subheader + '</div>');
    $('#task-header').append(
        $('<audio>').attr({
            id: 'start-sound',
            src: '/sound/start.wav',
            autostart: 'false'
        })
    );
    $('#rsme-header').remove();
    $('#rsme-slider').remove();
    $('#main').append($('<div>').attr('id', 'stimulus').html('<div class="ui header disabled">' + taskOptions.empty_stimulus + '</div>'));
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary button').text('Start ' + subheader + ': ' + block.level_alias).click(function () {
            playStartSound();
            startCurrentBlock();
        })
    );
};

function startCurrentBlock() {
    currentBlockRunning = true;
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui two large buttons').append(
            $('<div>').addClass('ui positive left labeled icon button').html('<i class="arrow left icon"></i>Target').click(function () {
                markAsTarget(new Date());
            })
        ).append(
            $('<div>').addClass('or')
        ).append(
            $('<div>').addClass('ui negative right labeled icon button').html('Non-Target<i class="arrow right icon"></i>').click(function () {
                markAsNonTarget(new Date());
            })
        ).append(
            $('<audio>').attr({
                id: 'correct-sound',
                src: '/sound/correct.wav',
                autostart: 'false'
            })
        ).append(
            $('<audio>').attr({
                id: 'incorrect-sound',
                src: '/sound/incorrect.wav',
                autostart: 'false'
            })
        )
    );
};

function stopCurrentBlock() {
    currentBlockRunning = false;
};

function nextBlock() {
    elapsedTime = 0;
    currentBlockIndex++;
    currentBlockLoaded = false;
    currentBlockRunning = false;
    currentStimulusIndex = 0;
    currentStimulusIndexCache = -1;
};

function loadCurrentStimulus(stimulus) {
    $('#main').removeClass('tertiary inverted green red');
    $('#stimulus').html('<div class="ui header">' + stimulus + '</div>');
    currentStimulusLoadTime = new Date();
    blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].timestamp.load = currentStimulusLoadTime.toISOString();
};

function unloadCurrentStimulus() {
    $('#stimulus').html('<div class="ui header disabled">' + taskOptions.empty_stimulus + '</div>');
};

function nextStimulus() {
    currentStimulusIndex++;
};

function updateStimulusCache() {
    currentStimulusIndexCache++;
};

function playStartSound() {
    var sound = document.getElementById('start-sound');
    sound.play();
};

function playStopSound() {
    var sound = document.getElementById('stop-sound');
    sound.play();
};

function playCorrectSound() {
    var sound = document.getElementById('correct-sound');
    sound.play();
};

function playIncorrectSound() {
    var sound = document.getElementById('incorrect-sound');
    sound.play();
};

function alertCorrect() {
    $('#main').addClass('tertiary inverted green');
    playCorrectSound();
};

function alertIncorrect() {
    $('#main').addClass('tertiary inverted red');
    playIncorrectSound();
};

function markAsTarget(responseTime) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = responseTime.getTime() - currentStimulusLoadTime.getTime();
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = true;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].timestamp.response = responseTime.toISOString();
        if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].is_target === true) {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = true;
            alertCorrect();
        } else {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = false;
            alertIncorrect();
        };
    };
};

function markAsNonTarget(responseTime) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = responseTime.getTime() - currentStimulusLoadTime.getTime();
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = false;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].timestamp.response = responseTime.toISOString();
        if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].is_target === false) {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = true;
            alertCorrect();
        } else {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = false;
            alertIncorrect();
        };
    };
};

$(document).keydown(function(event){
    if (currentBlockRunning) {
        if (event.keyCode === 37) {
            markAsTarget(new Date());
        } else if (event.keyCode === 39){
            markAsNonTarget(new Date());
        };
    };
});

function loadRSME() {
    $('#stimulus').remove();
    $('#main').removeClass('tertiary inverted green red').append(
        $('<div>').attr('id', 'rsme-header').addClass('ui header').text('Please rate your effort in this task')
    ).append(
        $('<div>').attr('id', 'rsme-slider')
    );
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary button').text('Confirm and Submit').click(function () {
            blocks[currentBlockIndex].rsme = RSMESlider.noUiSlider.get();
            if (currentBlockIndex < blocks.length - 1) {
                nextBlock();
            } else {
                loadResults();
            };
        })
    );
    var RSMESlider = document.getElementById('rsme-slider');
    noUiSlider.create(RSMESlider, {
        start: [50],
        direction: 'rtl',
        orientation: 'vertical',
        step: 1,
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': 0,
            'max': 150
        },
        pips: {
            mode: 'values',
            values: [2, 13, 25, 37, 57, 71, 85, 102, 112],
            density: 4
        }
    });
    $('.noUi-value').each(function () {
        var value = $(this).text();
        var label = taskOptions.rsme[value] + ' (' + value + ')';
        $(this).text(label);
    });
};

function loadResults() {
    $('#task-header .image').attr({
        src: '/images/logo.png',
        alt: 'N-Back Task Logo'
    });
    $('#task-header .content').html('The N-Back Task<div class="sub header">Results</div>');
    $('#rsme-header').remove();
    $('#rsme-slider').remove();
    $('#main').addClass('form').append(
        $('<textarea>').attr({
            id: 'results',
            rows: '15'
        })
    ).form('set value', 'results', JSON.stringify({
        'rest_start_timestamp': restBlockStartTime,
        'blocks': blocks
    }));
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary copy button').attr('data-clipboard-target', '#results').text('Copy to Clipboard')
    );
    new Clipboard('.copy.button');
};

function runTask(blocks) {
    loadCurrentBlock(blocks[currentBlockIndex]);
    setInterval(function () {
        if (!currentBlockLoaded) {
            loadCurrentBlock(blocks[currentBlockIndex]);
        };
        if (currentBlockRunning) {
            tick();
            if (currentStimulusIndex < blocks[currentBlockIndex].stimuli.length) {
                if (elapsedTime === blocks[currentBlockIndex].stimuli[currentStimulusIndex].load_time) {
                    updateStimulusCache();
                    loadCurrentStimulus(blocks[currentBlockIndex].stimuli[currentStimulusIndex].stimulus);
                };
                if (elapsedTime === blocks[currentBlockIndex].stimuli[currentStimulusIndex].unload_time) {
                    unloadCurrentStimulus();
                    nextStimulus();
                };
            } else if (elapsedTime === blocks[currentBlockIndex].total_time) {
                stopCurrentBlock();
                loadRSME();
            };
        };
    }, taskOptions.granularity);
};

function runTaskWithRest(blocks) {
    var subheader = 'Rest';
    $('#task-header .content').append($('<div>').addClass('sub header').text(subheader));
    $('#task-header').append(
        $('<audio>').attr({
            id: 'start-sound',
            src: '/sound/start.wav',
            autostart: 'false'
        })
    ).append(
        $('<audio>').attr({
            id: 'stop-sound',
            src: '/sound/stop.wav',
            autostart: 'false'
        })
    );
    $('#main').append($('<div>').attr('id', 'stimulus').html('<div class="ui header disabled">Rest</div>'));
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary button').text('Start ' + subheader).click(function () {
            restBlockStartTime = new Date().toISOString();
            playStartSound();
            $('#action-buttons').children().remove();
            $('#action-buttons').append(
                $('<div>').attr('id', 'clock').addClass('ui fluid large primary button')
            );
            $('#clock').countdown(new Date().getTime() + taskOptions.rest_interval, function (event) {
                $(this).text(event.strftime('%-M:%S'));
            }).on('finish.countdown', function (event) {
                playStopSound();
                runTask(blocks);
            });
        })
    );
};
