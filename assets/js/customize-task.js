// customize-task.js

var elapsedTime = 0;
var currentBlockIndex = 0;
var currentBlockLoaded = false;
var currentBlockRunning = false;
var currentStimulusIndex = 0;


function tick() {
    elapsedTime += taskOptions.granularity;
};

function resetTimer() {
    elapsedTime = 0;
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
};

function startCurrentBlock() {
    currentBlockRunning = true;
    $('#action-buttons div.start.button').remove();
    $('#action-buttons').append(
        $('<div>').addClass('ui two large buttons').append(
            $('<div>').addClass('ui positive left labeled icon target button').html('<i class="checkmark icon"></i>Target')
        ).append(
            $('<div>').addClass('ui negative right labeled icon non-target button').html('Non-Target<i class="remove icon"></i>')
        )
    );
};

function stopCurrentBlock() {
    currentBlockRunning = false;
};

function resetCurrenBlock() {
    blocks = generateBlocks();
    currentBlockIndex = 0;
    currentBlockRunning = false;
    elapsedTime = 0;
    currentStimulusIndex = 0;
};

function loadStimulus(stimulus) {
    $('#stimulus-wrapper').html('<div class="ui header">' + stimulus + '</div>');
};

function unloadStimulus() {
    $('#stimulus-wrapper').html('<div class="ui header disabled">' + taskOptions.empty_stimulus + '</div>');
};

function nextStimulus() {
    currentStimulusIndex++;
};

function loadRSME() {};

$('#action-buttons .start.button').on('click', function () {
    startCurrentBlock();
});

var blocks = generateBlocks();

loadCurrentBlock(blocks[currentBlockIndex]);
var taskTimer = setInterval(function () {
    if (currentBlockRunning) {
        if (!currentBlockLoaded) {
            loadCurrentBlock(blocks[currentBlockIndex]);
        };
        tick();
        if (currentStimulusIndex < blocks[currentBlockIndex].stimuli.length) {
            if (elapsedTime === blocks[currentBlockIndex].stimuli[currentStimulusIndex].load_time) {
                loadStimulus(blocks[currentBlockIndex].stimuli[currentStimulusIndex].stimulus);
            };
            if (elapsedTime === blocks[currentBlockIndex].stimuli[currentStimulusIndex].unload_time) {
                unloadStimulus();
                nextStimulus();
            };
        } else if (elapsedTime === blocks[currentBlockIndex].end_time) {
            stopCurrentBlock();
            loadRSME();
        };
    };
}, taskOptions.granularity);