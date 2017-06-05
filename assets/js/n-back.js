// n-back.js

var stimuliPool = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

function getStimuli(step, totalNum=48, targetNum=16) {
    var stimuli = [];
    if (step === 0) {
        for (var i = 0; i < totalNum; i++) {
            stimuli.push({
                'stimulus': _.sample(stimuliPool),
                'is_target': true
            });
        };
    } else if (step > 0) {
        for (var i = 0; i < totalNum; i++) {
            if (i < step) {
                stimuli.push({
                    'stimulus': _.sample(stimuliPool),
                    'is_target': false
                });
            } else {
                var target = _.nth(stimuli, -step).stimulus;
                if (_.random(1, totalNum - i) <= targetNum) {
                    targetNum--;
                    stimuli.push({
                        'stimulus': target,
                        'is_target': true
                    });
                } else {
                    stimuli.push({
                        'stimulus': _.sample(_.difference(stimuliPool, [target])),
                        'is_target': false
                    });
                };
            };
        };
    };
    return stimuli;
};

function getBlocks(conditions=[0, 1, 2]) {
    var blocks = _.sampleSize(conditions, 2);
    return _.concat(_.shuffle(_.difference(conditions, [blocks[0]])), blocks, _.shuffle(_.difference(conditions, [blocks[1]])));
};

function getSession(conditions=[0, 1, 2], totalNum=48, targetNum=16) {
    return _.map(getBlocks(conditions), function (step) {
        return getStimuli(step, totalNum, targetNum);
    });
}