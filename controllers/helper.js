module.exports.createError = function (statusCode, errorMessage) {
    return {
        error: {
            statusCode: statusCode,
            message: errorMessage
        }
    }
}

module.exports.sError = function () {
    return this.createError(400, "Something went wrong")
}

module.exports.getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers
            .authorization
            .split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};