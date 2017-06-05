// n-back.js

var stimuliPool = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

function getStimuli(level, totalNum=48, targetNum=16) {
    var stimuli = [];
    if (level === 0) {
        for (var i = 0; i < totalNum; i++) {
            stimuli.push({
                'stimulus': _.sample(stimuliPool),
                'is_target': true
            });
        };
    } else if (level > 0) {
        for (var i = 0; i < totalNum; i++) {
            if (i < level) {
                stimuli.push({
                    'stimulus': _.sample(stimuliPool),
                    'is_target': false
                });
            } else {
                var target = _.nth(stimuli, -level).stimulus;
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
    return {
        'level': String(level) + '-Back',
        'stimuli': stimuli
    };
};

function getBlocks(levels=[0, 1, 2]) {
    var blocks = _.sampleSize(levels, 2);
    return _.concat(_.shuffle(_.difference(levels, [blocks[0]])), blocks, _.shuffle(_.difference(levels, [blocks[1]])));
};

function getSession(levels=[0, 1, 2], totalNum=48, targetNum=16) {
    return _.map(getBlocks(levels), function (level) {
        return getStimuli(level, totalNum, targetNum);
    });
};