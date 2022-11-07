"use strict";
/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: February 2018
 *
 * Partly based on DynUtils
 * https://github.com/mysqljs/sqlstring/blob/master/lib/DynUtils.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryUtils = exports.VarType = void 0;
const ID_GLOBAL_REGEXP = /`/g;
const QUAL_GLOBAL_REGEXP = /\./g;
const CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
const CHARS_ESCAPE_MAP = {
    "\0": "\\0",
    "\b": "\\b",
    "\t": "\\t",
    "\n": "\\n",
    "\r": "\\r",
    "\x1a": "\\Z",
    '"': '\\"',
    "'": "\\'",
    "\\": "\\\\",
    "%": "\\"
};
const buffer_1 = require("buffer");
const types_1 = require("../types/types");
var VarType;
(function (VarType) {
    VarType[VarType["None"] = 0] = "None";
    VarType[VarType["NullOrUndefined"] = 1] = "NullOrUndefined";
    VarType[VarType["String"] = 2] = "String";
    VarType[VarType["Number"] = 3] = "Number";
    VarType[VarType["Boolean"] = 4] = "Boolean";
    VarType[VarType["Object"] = 5] = "Object";
    VarType[VarType["Date"] = 6] = "Date";
    VarType[VarType["Array"] = 7] = "Array";
    VarType[VarType["Buffer"] = 8] = "Buffer";
})(VarType = exports.VarType || (exports.VarType = {}));
class QueryUtils {
    static prepMySqlDate(dateObj) {
        dateObj.setHours(dateObj.getHours() - 2);
        return dateObj.toISOString().slice(0, 19).replace("T", " ");
    }
    static parseCompareType(value1, value2, whereType) {
        let sql = "";
        switch (whereType) {
            case types_1.CompareType.Equal:
                sql = value1 + " = " + QueryUtils.escape(value2);
                break;
            // Equal (Safe to compare NULL values)
            case types_1.CompareType.SafeEqual:
                sql = value1 + " <=> " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.GreaterThan:
                sql = value1 + " > " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.GreaterOrEquals:
                sql = value1 + " >= " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.LessThan:
                sql = value1 + " < " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.LessOrEquals:
                sql = value1 + " <= " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.Between:
                sql = "BETWEEN " + QueryUtils.escape(value1) + " AND " + QueryUtils.escape(value2);
                break;
            case types_1.CompareType.Or:
                sql = value1 + " <= " + QueryUtils.escape(value2);
                break;
            default: {
                sql = "UNKNOWN_DIRECTIVE";
            }
        }
        return sql;
    }
    static escapeId(val, forbidQualified = false) {
        if (Array.isArray(val)) {
            let sql = "";
            for (let i = 0; i < val.length; i++) {
                sql += (i === 0 ? "" : ", ") + QueryUtils.escapeId(val[i], forbidQualified);
            }
            return sql;
        }
        else if (forbidQualified) {
            return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``") + "`";
        }
        else {
            return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``").replace(QUAL_GLOBAL_REGEXP, "`.`") + "`";
        }
    }
    /**
     *
     * @param val
     * @param stringifyObjects
     * @param timeZone
     */
    static escape(val, stringifyObjects = true, timeZone = 0) {
        if (!val) {
            return "NULL";
        }
        let result = "";
        switch (typeof val) {
            case "boolean":
                result = val ? "true" : "false";
                break;
            case "number":
                result = val + "";
                break;
            case "object":
                if (val instanceof Date) {
                    result = QueryUtils.dateToString(val, timeZone || "local");
                }
                else if (Array.isArray(val)) {
                    result = QueryUtils.arrayToList(val, timeZone);
                }
                else if (buffer_1.Buffer.isBuffer(val)) {
                    result = QueryUtils.bufferToString(val);
                }
                else if (stringifyObjects) {
                    result = QueryUtils.escapeString(val.toString());
                }
                else {
                    result = QueryUtils.objectToValues(val, timeZone);
                }
            default:
                result = QueryUtils.escapeString(val);
        }
        return result;
    }
    static arrayToList(array, timeZone) {
        let sql = "";
        for (let i = 0; i < array.length; i++) {
            let val = array[i];
            if (Array.isArray(val)) {
                sql += (i === 0 ? "" : ", ") + "(" + QueryUtils.arrayToList(val, timeZone) + ")";
            }
            else {
                sql += (i === 0 ? "" : ", ") + QueryUtils.escape(val, true, timeZone);
            }
        }
        return sql;
    }
    static format(sql, values, stringifyObjects, timeZone) {
        if (values == null) {
            return sql;
        }
        if (!(values instanceof Array || Array.isArray(values))) {
            values = [values];
        }
        let chunkIndex = 0;
        let placeholdersRegex = /\?+/g;
        let result = "";
        let valuesIndex = 0;
        let match;
        while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
            let len = match[0].length;
            if (len > 2) {
                continue;
            }
            let value = len === 2
                ? QueryUtils.escapeId(values[valuesIndex])
                : QueryUtils.escape(values[valuesIndex], stringifyObjects, timeZone);
            result += sql.slice(chunkIndex, match.index) + value;
            chunkIndex = placeholdersRegex.lastIndex;
            valuesIndex++;
        }
        if (chunkIndex === 0) {
            // Nothing was replaced
            return sql;
        }
        if (chunkIndex < sql.length) {
            return result + sql.slice(chunkIndex);
        }
        return result;
    }
    static dateToString(date, timeZone) {
        let dt = new Date(date);
        if (isNaN(dt.getTime())) {
            return "NULL";
        }
        let year, month, day, hour, minute, second, millisecond;
        if (timeZone === "local") {
            year = dt.getFullYear();
            month = dt.getMonth() + 1;
            day = dt.getDate();
            hour = dt.getHours();
            minute = dt.getMinutes();
            second = dt.getSeconds();
            millisecond = dt.getMilliseconds();
        }
        else {
            let tz = QueryUtils.convertStrToTimezone(timeZone);
            if (tz != 0) {
                dt.setTime(dt.getTime() + tz * 60000);
            }
            year = dt.getUTCFullYear();
            month = dt.getUTCMonth() + 1;
            day = dt.getUTCDate();
            hour = dt.getUTCHours();
            minute = dt.getUTCMinutes();
            second = dt.getUTCSeconds();
            millisecond = dt.getUTCMilliseconds();
        }
        // YYYY-MM-DD HH:mm:ss.mmm
        var str = QueryUtils.zeroPad(year, 4) +
            "-" +
            QueryUtils.zeroPad(month, 2) +
            "-" +
            QueryUtils.zeroPad(day, 2) +
            " " +
            QueryUtils.zeroPad(hour, 2) +
            ":" +
            QueryUtils.zeroPad(minute, 2) +
            ":" +
            QueryUtils.zeroPad(second, 2) +
            "." +
            QueryUtils.zeroPad(millisecond, 3);
        return QueryUtils.escapeString(str);
    }
    static bufferToString(buffer) {
        return "X" + QueryUtils.escapeString(buffer.toString("hex"));
    }
    static objectToValues(object, timeZone) {
        let sql = "";
        for (let key in object) {
            let val = null;
            if (object.hasOwnProperty(key)) {
                val = object[key];
            }
            if (typeof val === "function") {
                continue;
            }
            sql +=
                (sql.length === 0 ? "" : ", ") +
                    QueryUtils.escapeId(key) +
                    " = " +
                    QueryUtils.escape(val, true, timeZone);
        }
        return sql;
    }
    static escapeString(val) {
        if (!val || typeof val !== "string")
            return "NULL";
        try {
            let replacer = (char) => {
                if (!char)
                    return "";
                switch (char) {
                    case '\0':
                        return '\\0';
                    case '\x08':
                        return '\\b';
                    case '\x09':
                        return '\\t';
                    case '\x1a':
                        return '\\z';
                    case '\n':
                        return '\\n';
                    case '\r':
                        return '\\r';
                    case '\"':
                    case '\'':
                    case '\\':
                    case '%':
                        // prepends a backslash to backslash, percent, and double/single quotes
                        return '\\' + char;
                }
            };
            return val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, replacer);
        }
        catch (e) {
            return "NULL";
        }
    }
    static zeroPad(value, length) {
        value = value.toString();
        while (value.length < length) {
            value = "0" + value;
        }
        return value;
    }
    static convertStrToTimezone(tz) {
        if (tz === "Z") {
            return 0;
        }
        let m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
        if (m) {
            return (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) * 60;
        }
        return 0;
    }
}
exports.QueryUtils = QueryUtils;
//# sourceMappingURL=query-utils.js.map