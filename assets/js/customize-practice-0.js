// customize-practice-0.js

var blocks = generatePracticeBlocks(levels=[0]);
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