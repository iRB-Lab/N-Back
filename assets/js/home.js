// home.js

// GitHub
function updateGitHub() {
    $('#github-watch img').attr('src', 'https://img.shields.io/github/watchers/' + repository + '.svg?style=social&label=Watch');
    $('#github-star img').attr('src', 'https://img.shields.io/github/stars/' + repository + '.svg?style=social&label=Star');
    $('#github-fork img').attr('src', 'https://img.shields.io/github/forks/' + repository + '.svg?style=social&label=Fork');
};
updateGitHub();
setInterval(function () {
    updateGitHub();
}, 15000);

// version
dayjs.extend(dayjs_plugin_relativeTime);
function updateVersion(timestamp) {
    $('#version img').attr('src', 'https://img.shields.io/badge/Updated-' + encodeURIComponent(dayjs(timestamp).fromNow()) + '-brightgreen.svg');
};
var updateAt = $('#version').attr('data-update-at');
updateVersion(updateAt);
setInterval(function () {
    updateVersion(updateAt);
}, 15000);