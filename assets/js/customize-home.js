// customize-home.js

// GitHub
function updateGitHub() {
    $('#github-watch img').attr('src', 'https://img.shields.io/github/watchers/iROCKBUNNY/BYR-Navi.svg?style=social&label=Watch');
    $('#github-star img').attr('src', 'https://img.shields.io/github/stars/iROCKBUNNY/BYR-Navi.svg?style=social&label=Star');
    $('#github-fork img').attr('src', 'https://img.shields.io/github/forks/iROCKBUNNY/BYR-Navi.svg?style=social&label=Fork');
};
updateGitHub();
setInterval(function () {
    updateGitHub();
}, 15000);

// version
moment.locale('zh-cn');
function updateVersion(timestamp) {
    $('#version img').attr('src', 'https://img.shields.io/badge/%E6%9B%B4%E6%96%B0%E4%BA%8E-' + encodeURIComponent(moment(timestamp).fromNow()) + '-brightgreen.svg');
};
var updateAt = $('#version').attr('data-update-at');
updateVersion(updateAt);
setInterval(function () {
    updateVersion(updateAt);
}, 15000);