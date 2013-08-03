exports.pad = function(input) {
    var BASE = "0000";
    return input ? BASE .substr(0, 4 - Math.ceil(input / 10)) + input : BASE;
}