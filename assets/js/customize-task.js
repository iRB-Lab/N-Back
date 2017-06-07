// customize-task.js

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
    $('#task-header .image').attr({
        src: block.image_src,
        alt: block.image_alt
    });
    $('#task-header .content').html(function () {
        var subheader = currentBlockIndex + 1;
        return (block.header + '<div class="sub header">Block ' + String(subheader) + '/' + String(blocks.length) + '</div>');
    });
    $('#rsme-header').remove();
    $('#rsme-slider').remove();
    $('#main').append($('<div>').attr('id', 'stimulus').html('<div class="ui header disabled">' + taskOptions.empty_stimulus + '</div>'));
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary start button').text('Start Task').click(function () {
            startCurrentBlock();
        })
    );
};

function startCurrentBlock() {
    currentBlockRunning = true;
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui two large buttons').append(
            $('<div>').addClass('ui positive left labeled icon target button').html('<i class="left arrow icon"></i>Target').click(function () {
                markAsTarget();
            })
        ).append(
            $('<div>').addClass('or')
        ).append(
            $('<div>').addClass('ui negative right labeled icon non-target button').html('Non-Target<i class="right arrow icon"></i>').click(function () {
                markAsNonTarget();
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

function alertCorrect() {
    $('#main').addClass('tertiary inverted green');
};

function alertIncorrect() {
    $('#main').addClass('tertiary inverted red');
};

function markAsTarget(date) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = date - currentStimulusLoadTime;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = true;
        if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].is_target === true) {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = true;
            alertCorrect();
        } else {
            blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = false;
            alertIncorrect();
        };
    };
};

function markAsNonTarget(date) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = date - currentStimulusLoadTime;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = false;
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
        $('<div>').addClass('ui fluid large primary confirm-rsme button').text('Confirm and Submit').click(function () {
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
        start: [0],
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
    ).form('set value', 'results', JSON.stringify(blocks));
    $('#action-buttons').children().remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui fluid large primary copy button').attr('data-clipboard-target', '#results').text('Copy to Clipboard')
    );
    new Clipboard('.copy.button');
};


var blocks = generateBlocks();
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