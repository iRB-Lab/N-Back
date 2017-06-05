// customize-home.js

// GitHub
function updateGitHub() {
    $('#github-watch img').attr('src', 'https://img.shields.io/github/watchers/iROCKBUNNY/N-Back.svg?style=social&label=Watch');
    $('#github-star img').attr('src', 'https://img.shields.io/github/stars/iROCKBUNNY/N-Back.svg?style=social&label=Star');
    $('#github-fork img').attr('src', 'https://img.shields.io/github/forks/iROCKBUNNY/N-Back.svg?style=social&label=Fork');
};
updateGitHub();
setInterval(function () {
    updateGitHub();
}, 15000);

// version
function updateVersion(timestamp) {
    $('#version img').attr('src', 'https://img.shields.io/badge/Updated-' + encodeURIComponent(moment(timestamp).fromNow()) + '-brightgreen.svg');
};
var updateAt = $('#version').attr('data-update-at');
updateVersion(updateAt);
setInterval(function () {
    updateVersion(updateAt);
}, 15000);