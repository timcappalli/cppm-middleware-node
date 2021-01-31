var isEmpty = function (obj) {
    return Object.keys(obj).length === 0;
};

var b64encode = function (str) {
    let buff = Buffer.from(str, 'utf-8');
    let b64output = buff.toString('base64');
    return b64output;
};

var b64decode = function (b64) {
    let buff = Buffer.from(b64, 'base64');
    let str = buff.toString('utf-8');
    return str;
};

module.exports = { isEmpty, b64encode, b64decode };