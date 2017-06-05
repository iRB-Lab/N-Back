// customize-task.js

var blocks = getBlocks();

// Block 1
$('#action-buttons .start.button').on('click', function () {
    $(this).addClass('loading');
    $('#main').prepend($('<div>').attr('id', 'block-loading-progress').addClass('ui top attached indicating progress').append($('<div>').addClass('bar')).progress({
        total: config.baseline_interval / config.granularity,
        onSuccess: function () {
            $('#block-loading-progress').fadeOut(1000, function () {
                $('#block-loading-progress').remove();
            });
        }
    }));
    loadBlock(blocks[0]);
});
