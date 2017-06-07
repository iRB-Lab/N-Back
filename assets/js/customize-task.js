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
        return (block.header + '<div class="sub header">Block ' + String(subheader) + '/6</div>');
    });
    $('#rsme-header').remove();
    $('#rsme-slider').remove();
    $('#main').prepend($('<div>').attr('id', 'stimulus').html('<div class="ui header disabled">×</div>'));
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
            $('<div>').addClass('ui positive left labeled icon target button').html('<i class="checkmark icon"></i>Target').click(function () {
                markAsTarget();
            })
        ).append(
            $('<div>').addClass('or')
        ).append(
            $('<div>').addClass('ui negative right labeled icon non-target button').html('Non-Target<i class="remove icon"></i>').click(function () {
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
};

function loadCurrentStimulus(stimulus) {
    $('#stimulus').html('<div class="ui header">' + stimulus + '</div>');
    currentStimulusLoadTime = new Date();
};

function unloadCurrentStimulus() {
    $('#stimulus').html('<div class="ui header disabled">' + taskOptions.empty_stimulus + '</div>');
};

function nextStimulus() {
    currentStimulusIndex++;
};

function markAsTarget(date) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = date - currentStimulusLoadTime;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = true;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].is_target === true);
        console.log(blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time);
    };
};

function markAsNonTarget(date) {
    if (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time === null) {
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time = date - currentStimulusLoadTime;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].answer = false;
        blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].correct = (blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].is_target === false);
        console.log(blocks[currentBlockIndex].stimuli[currentStimulusIndexCache].response_time);
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
    $('#main').prepend(
        $('<div>').attr('id', 'rsme-slider')
    ).prepend(
        $('<div>').attr('id', 'rsme-header').addClass('ui header').text('Please rate your effort in this task')
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
                currentStimulusIndexCache++;
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