"use strict";
/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 *
 * Created by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * File Date: 2020-04-02 15:20
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarUtils = void 0;
const types_1 = require("../types/types");
const query_utils_1 = require("./query-utils");
class VarUtils {
    static getVarType(value) {
        let result = query_utils_1.VarType.None;
        if (value === undefined || value === null) {
            return query_utils_1.VarType.NullOrUndefined;
        }
        switch (typeof value) {
            case "string":
                result = query_utils_1.VarType.String;
                break;
            case "boolean":
                result = query_utils_1.VarType.Boolean;
                break;
            case "number":
                result = query_utils_1.VarType.Number;
                break;
            case "object":
                if (value instanceof Date) {
                    result = query_utils_1.VarType.Date;
                }
                else if (Array.isArray(value)) {
                    result = query_utils_1.VarType.Array;
                }
                else if (Buffer.isBuffer(value)) {
                    result = query_utils_1.VarType.Buffer;
                }
                else {
                    result = query_utils_1.VarType.Object;
                }
                break;
        }
        return result;
    }
    /**
     * Checks wheater a given variable is of string fieldType
     * and has a length greater than 0
     * @param value - variable
     */
    static haveStrValue(value) {
        const varType = VarUtils.getVarType(value);
        return value !== undefined && varType === query_utils_1.VarType.String && value.length > 0;
    }
    static isNull(value) {
        return !value ?? true;
    }
    static isNotNull(value) {
        return !VarUtils.isNull(value);
    }
    static isWhereRec(record) {
        return record !== null && record.command in types_1.SqlWhere;
    }
}
exports.VarUtils = VarUtils;
//# sourceMappingURL=var.utils.js.map