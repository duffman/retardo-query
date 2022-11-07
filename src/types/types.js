"use strict";
/**
 * Coldmind AB ("COMPANY") CONFIDENTIAL
 * Unpublished Copyright (c) 2020 Coldmind AB, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of COMPANY. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * File Date: 2018-04-02 14:09
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlInsert = exports.SqlWhere = exports.SqlSelect = exports.ColumnType = exports.OrderType = exports.CompareType = void 0;
const sql_command_type_1 = require("./sql-command.type");
var CompareType;
(function (CompareType) {
    CompareType[CompareType["Equal"] = 0] = "Equal";
    CompareType[CompareType["SafeEqual"] = 1] = "SafeEqual";
    CompareType[CompareType["NotEqual"] = 2] = "NotEqual";
    CompareType[CompareType["GreaterThan"] = 3] = "GreaterThan";
    CompareType[CompareType["GreaterOrEquals"] = 4] = "GreaterOrEquals";
    CompareType[CompareType["LessThan"] = 5] = "LessThan";
    CompareType[CompareType["LessOrEquals"] = 6] = "LessOrEquals";
    CompareType[CompareType["Between"] = 7] = "Between";
    CompareType[CompareType["InValue"] = 8] = "InValue";
    CompareType[CompareType["InQuery"] = 9] = "InQuery";
    CompareType[CompareType["Or"] = 10] = "Or";
    CompareType[CompareType["In"] = 11] = "In";
})(CompareType = exports.CompareType || (exports.CompareType = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["None"] = 0] = "None";
    OrderType[OrderType["Asc"] = 1] = "Asc";
    OrderType[OrderType["Desc"] = 2] = "Desc";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var ColumnType;
(function (ColumnType) {
    // Numeric
    ColumnType["TinyInt"] = "TINYINT";
    ColumnType["SmallInt"] = "SMALLINT";
    ColumnType["MediumInt"] = "MEDIUMINT";
    ColumnType["Int"] = "INT";
    ColumnType["BigInt"] = "BIGINT";
    //
    ColumnType["Decimal"] = "DECIMAL";
    ColumnType["Float"] = "FLOAT";
    ColumnType["Double"] = "DOUBLE";
    ColumnType["Real"] = "REAL";
    //
    ColumnType["Bit"] = "BIT";
    ColumnType["Boolean"] = "BOOLEAN";
    ColumnType["Serial"] = "SERIAL";
    // Date and Time
    ColumnType["Date"] = "DATE";
    ColumnType["DateTime"] = "DATETIME";
    ColumnType["Timestamp"] = "TIMESTAMP";
    ColumnType["Time"] = "TIME";
    ColumnType["Year"] = "YEAR";
    // String
    ColumnType["Char"] = "";
    ColumnType["VarChar"] = "";
    //
    ColumnType["TinyText"] = "TINYTEXT";
    ColumnType["Text"] = "TEXT";
    ColumnType["MediumText"] = "MEDIUMTEXT";
    ColumnType["LongText"] = "LONGTEXT";
    //
    ColumnType["Binary"] = "BINARY";
    ColumnType["VarBinary"] = "VARBINARY";
    //
    ColumnType["TinyBlob"] = "TINYBLOB";
    ColumnType["Blob"] = "BLOB";
    ColumnType["MediumBlob"] = "MEDIUMBLOB";
    ColumnType["LongBlob"] = "LONGBLOB";
    //
    ColumnType["Enum"] = "ENUM";
    ColumnType["Set"] = "SET";
    // Geometry
    ColumnType["Geometry"] = "GEOMETRY";
    ColumnType["Point"] = "POINT";
    ColumnType["LineString"] = "LINESTRING";
    ColumnType["Polygon"] = "POLYGON";
    ColumnType["MultiPoint"] = "MULTIPOINT";
    ColumnType["MultiLineString"] = "MULTILINESTRING";
    ColumnType["MultiPolygon"] = "MULTIPOLYGON";
    ColumnType["GeometryCollection"] = "GEOMETRYCOLLECTION";
    ColumnType["Json"] = "JSON";
})(ColumnType = exports.ColumnType || (exports.ColumnType = {}));
var JoinType;
(function (JoinType) {
    JoinType[JoinType["Inner"] = 0] = "Inner";
    JoinType[JoinType["Outer"] = 1] = "Outer";
    JoinType[JoinType["Left"] = 2] = "Left";
    JoinType[JoinType["Right"] = 3] = "Right";
    JoinType[JoinType["Cross"] = 4] = "Cross";
})(JoinType || (JoinType = {}));
exports.SqlSelect = [sql_command_type_1.QueryOp.Select, sql_command_type_1.QueryOp.SelectRaw, sql_command_type_1.QueryOp.SelectAvg];
exports.SqlWhere = [sql_command_type_1.QueryOp.Where, sql_command_type_1.QueryOp.WhereRaw, sql_command_type_1.QueryOp.WhereIn, sql_command_type_1.QueryOp.WhereNotIn];
exports.SqlInsert = [sql_command_type_1.QueryOp.Insert];
//# sourceMappingURL=types.js.map