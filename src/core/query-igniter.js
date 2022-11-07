"use strict";
/**
 * The file is part of the Coldmind SQL Igniter project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryIgniter = exports.SqlState = void 0;
const count_1 = require("../components/count");
const insert_1 = require("../components/insert");
const join_operation_1 = require("../components/join.operation");
const join_operation_2 = require("../components/join.operation");
const operation_1 = require("../components/operation");
const select_1 = require("../components/select");
const select_2 = require("../components/select");
const set_operation_1 = require("../components/set.operation");
const set_operation_2 = require("../components/set.operation");
const update_operation_1 = require("../components/update.operation");
const where_operation_1 = require("../components/where");
const where_operation_2 = require("../components/where");
const sql_command_type_1 = require("../types/sql-command.type");
const types_1 = require("../types/types");
const query_utils_1 = require("../utils/query-utils");
const var_utils_1 = require("../utils/var.utils");
const l = console.log;
const e = console.error;
var SqlState;
(function (SqlState) {
    SqlState[SqlState["Unset"] = 0] = "Unset";
    SqlState[SqlState["None"] = 1] = "None";
    SqlState[SqlState["Select"] = 2] = "Select";
    SqlState[SqlState["Select_All"] = 3] = "Select_All";
    SqlState[SqlState["Insert"] = 4] = "Insert";
    SqlState[SqlState["InsertMulti"] = 5] = "InsertMulti";
    SqlState[SqlState["Update"] = 6] = "Update";
    SqlState[SqlState["Update_Set"] = 7] = "Update_Set";
    SqlState[SqlState["Delete"] = 8] = "Delete";
})(SqlState = exports.SqlState || (exports.SqlState = {}));
class QueryIgniter {
    records;
    currRec = null;
    prevRec = null;
    constructor() {
        this.records = new Array();
    }
    resetQuery() {
        this.records.length = 0;
    }
    debugShowAll() {
        for (let item of this.records) {
            l("item ::", item);
        }
    }
    escapeVal(value) {
        return `'${query_utils_1.QueryUtils.escape(value)}'`;
    }
    isSelectRec(arec) {
        return arec instanceof select_2.Select || arec instanceof select_1.SelectAll;
    }
    toSql() {
        let command;
        let inUpdate = false;
        let sql = "";
        for (let i = 0; i < this.records.length; i++) {
            this.prevRec = this.currRec;
            this.currRec = this.records[i];
            if (this.currRec instanceof count_1.SelectCount) {
                sql += this.parseSelectCount();
            }
            if (this.currRec instanceof insert_1.Insert) {
                sql += this.parseInsert();
            }
            if (this.currRec instanceof update_operation_1.Update) {
                inUpdate = true;
                sql += this.parseUpdate();
            }
            if (this.currRec instanceof select_2.Select) {
                sql += this.parseSelect();
            }
            if (this.currRec instanceof select_1.SelectAll) {
                sql += this.parseSelectAll();
            }
            if (this.currRec instanceof operation_1.From) {
                sql += this.parseFrom();
            }
            if (inUpdate && this.currRec instanceof set_operation_1.SetOperation) {
                sql += this.parseSet();
            }
            if (this.currRec instanceof set_operation_2.SetMulti) {
                sql += this.parseSetMulti();
            }
            if (this.currRec instanceof join_operation_1.LeftJoin) {
                sql += this.parseLeftJoin();
            }
            if (var_utils_1.VarUtils.isWhereRec(this.currRec)) {
                sql += this.parseWhere();
            }
            if (this.currRec instanceof operation_1.And) {
                sql += this.parseAnd();
            }
            if (this.currRec instanceof operation_1.OrderBy) {
                sql += this.parseOrderBy();
            }
            if (this.currRec instanceof operation_1.Limit) {
                sql += this.parseLimit();
            }
        }
        return sql;
    }
    selectAll(...elements) {
        this.records.push(new select_1.SelectAll(elements));
        return this;
    }
    count(tableName, alias, column = "*") {
        this.records.push(new count_1.SelectCount(tableName, column, alias));
        return this;
    }
    update(table) {
        this.records.push(new update_operation_1.Update(table));
        return this;
    }
    delete(table) {
        this.records.push(new operation_1.Delete(table));
        return this;
    }
    insert(data, tableName, mySQLReplace) {
        this.resetQuery(); //TODO: Split into multiple queries instead of clearing-
        this.records.push(new insert_1.Insert(data, tableName, mySQLReplace));
        return this;
    }
    replace(data, tableName) {
        this.resetQuery(); //TODO: Split into multiple queries instead of clearing-
        return this.insert(data, tableName, true);
    }
    with(...data) {
        this.records.push(new operation_1.With(data));
        return this;
    }
    into(tableName) {
        this.records.push(new operation_1.Into(tableName));
        return this;
    }
    set(column, value) {
        this.records.push(new set_operation_1.SetOperation(column, value));
        return this;
    }
    setMulti(data, tableName) {
        this.records.push(new set_operation_2.SetMulti(data, tableName));
        return this;
    }
    join(columns) {
        this.records.push(new join_operation_2.Join(columns));
        return this;
    }
    subQuery(query) {
        this.records.push(new operation_1.SubQuery(query));
        return this;
    }
    joinTable(tableName, on, value, escapeVal = true) {
        this.records.push(new join_operation_1.LeftJoin(tableName, on, value, escapeVal));
        return this;
    }
    from(tableName, alias) {
        let rec = new operation_1.From(tableName, alias);
        this.records.push(rec);
        return this;
    }
    equals(whereParamsObj, value2, whereType = types_1.CompareType.Equal) {
        this.records.push(new where_operation_2.Where(whereParamsObj, value2, whereType));
        return this;
    }
    where(value1, value2 = null, whereType = types_1.CompareType.Equal, escapeValue = true) {
        let rec = new where_operation_2.WhereSimple(value1, value2, whereType, escapeValue);
        this.records.push(rec);
        return this;
    }
    whereRaw(whereClause) {
        this.records.push(new where_operation_1.WhereRaw(whereClause));
        return this;
    }
    whereIn() {
        return this;
    }
    whereNotIn() {
        return this;
    }
    orWhere() {
        return this;
    }
    orWhereIn() {
        return this;
    }
    orWhereNotIn() {
        return this;
    }
    whereBetween(value, rangeStart, rangeEnd) {
        this.escapeVal(value);
        let rec = new where_operation_2.WhereBetween(types_1.CompareType.Between, value, rangeStart, rangeEnd);
        this.records.push(rec);
        return this;
    }
    orderBy(column, orderType = types_1.OrderType.None) {
        let rec = new operation_1.OrderBy(column, orderType);
        this.records.push(rec);
        return this;
    }
    orderByRand() {
        let rec = new operation_1.OrderBy("RAND()");
        this.records.push(rec);
        return this;
    }
    and(col, value = null, compType = types_1.CompareType.Equal, escapeVal = true) {
        let rec = new operation_1.And(col, value, compType, escapeVal);
        this.records.push(rec);
        return this;
    }
    limitBy(fromValue, toValue) {
        let rec = new operation_1.Limit(fromValue, toValue);
        this.records.push(rec);
        return this;
    }
    createTable() {
        return this;
    }
    ///////////////////////////////////////////
    //
    //     HELPERS
    //
    ///////////////////////////////////////////
    findRecord(command) {
        let result = this.findRecords(command);
        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    }
    findRecords(command, firstHit = false) {
        let result = [];
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record.command === command) {
                result.push(record);
                if (firstHit) {
                    break;
                }
            }
        }
        return result;
    }
    pluck(o, propertyNames) {
        return propertyNames.map((n) => o[n]);
    }
    parseSelectCount() {
        let result = ``;
        if (this.currRec instanceof count_1.SelectCount) {
            const rec = this.currRec;
            result += `SELECT COUNT(${rec.column})`;
            if (rec.alias) {
                result += ` AS ${rec.alias}`;
            }
            if (rec.tableName) {
                result += ` FROM ${rec.tableName}`;
            }
        }
        return result;
    }
    parseJoin() {
        let localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof join_operation_2.Join) {
                const dRec = record;
            }
        }
        return "";
    }
    ////////////////////////////////////////
    //
    //     INSERT
    //
    ////////////////////////////////////////
    parseInsert() {
        let record = this.records[0];
        if (!(record instanceof insert_1.Insert)) {
            return "";
        }
        let result = "";
        const dRec = record;
        let insertType = dRec.mySQLReplace ? sql_command_type_1.QueryOp.MySqlReplace : sql_command_type_1.QueryOp.Insert;
        let colNames = new Array();
        let colValues = new Array();
        let obj = dRec.data;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                colNames.push(key);
                colValues.push(obj[key]);
            }
        }
        for (let i = 0; i < colValues.length; i++) {
            let value = colValues[i];
            value = this.escapeVal(value);
            colValues[i] = value;
        }
        result = `${insertType} INTO ${dRec.tableName} (${colNames.join(",")}) VALUES (${colValues.join(",")})`;
        return result;
    }
    ////////////////////////////////////////
    //
    //     SELECT
    //
    ///////////////////////////////////////
    parseSelect() {
        let result = ``;
        if (this.currRec instanceof select_2.Select) {
            const rec = this.currRec;
            if (this.isSelectRec(this.prevRec)) {
                result += ",";
            }
            else {
                result += "SELECT";
            }
            result += ` ${rec.column}`;
        }
        return result;
    }
    parseSelectAll() {
        let result = ``;
        if (this.currRec instanceof select_1.SelectAll) {
            const rec = this.currRec;
            result += `SELECT * FROM ${rec.tableNames.join(", ")}`;
        }
        return result;
    }
    ////////////////////////////////////////
    //
    //     UPDATE
    //
    ///////////////////////////////////////
    parseUpdate() {
        const rec = this.currRec;
        return `UPDATE ${this.escapeVal(rec.table)}`;
    }
    ////////////////////////////////////////
    //
    //     DELETE
    //
    ///////////////////////////////////////
    parseDelete() {
        let result = ``;
        if (this.currRec instanceof operation_1.Delete) {
            result = `DELETE FROM ${this.escapeVal(this.currRec.tableName)}`;
        }
        return result;
    }
    ////////////////////////////////////////
    //
    //     DROP
    //
    ///////////////////////////////////////
    parseDrop() {
        let result = "";
        if (this.currRec instanceof operation_1.Drop) {
            const rec = this.currRec;
            result = `DROP ${this.escapeVal(rec.tableName)}`;
        }
        return result;
    }
    ////////////////////////////////////////
    //
    //     FROM
    //
    ///////////////////////////////////////
    parseFrom() {
        let result = "";
        if (this.currRec instanceof operation_1.From) {
            const rec = this.currRec;
            if (this.prevRec instanceof operation_1.From) {
                result += ",";
            }
            else {
                result += " " + sql_command_type_1.QueryOp.From;
            }
            result += " " + rec.table;
            if (rec.alias != null) {
                result += " AS " + rec.alias;
            }
        }
        return result;
    }
    ////////////////////////////////////////
    //
    //     SET
    //
    ///////////////////////////////////////
    parseSet() {
        let result = "";
        if (this.currRec instanceof set_operation_1.SetOperation) {
            const rec = this.currRec;
            if (!(this.prevRec instanceof set_operation_1.SetOperation)) {
                result += " SET";
            }
            else {
                result += ", ";
            }
            let val = rec.escape ? this.escapeVal(rec.value) : rec.value;
            result += " " + rec.column + "=" + val;
        }
        return result;
    }
    parseSetMulti() {
        let record = this.records[0];
        let result = "";
        if (!(record instanceof set_operation_2.SetMulti)) {
            return result;
        }
        const dRec = record;
        let setValues = new Array();
        let obj = dRec.data;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                setValues.push(`${key}=${this.escapeVal(obj[key])}`);
            }
        }
        if (record.tableName && this.prevRec?.command !== sql_command_type_1.QueryOp.Update) {
            result = `${sql_command_type_1.QueryOp.Update} ${dRec.tableName} `;
        }
        result += `${sql_command_type_1.QueryOp.Set} ${setValues.join(", ")}`;
        return result;
    }
    ////////////////////////////////////////
    //
    //     LEFT JOIN
    //
    ////////////////////////////////////////
    parseLeftJoin() {
        let result = "";
        if (this.currRec instanceof join_operation_1.LeftJoin) {
            const rec = this.currRec;
            result += " LEFT JOIN " + rec.table + " ON " + rec.on;
            if (rec.value) {
                rec.value = rec.escapeVal ? this.escapeVal(rec.value) : rec.value;
                result += " = " + rec.value;
            }
        }
        return result;
    } // parseLeftJoin
    ////////////////////////////////////////
    //
    //     WHERE
    //
    ////////////////////////////////////////
    parseWhere() {
        let result = ``;
        if (var_utils_1.VarUtils.isWhereRec(this.prevRec)) {
            result += " AND ";
        }
        else {
            result += " WHERE ";
        }
        if (this.currRec instanceof where_operation_2.WhereSimple) {
            result += query_utils_1.QueryUtils.parseCompareType(this.currRec.value1, this.currRec.value2, this.currRec.whereType);
        }
        if (this.currRec instanceof where_operation_2.Where) {
            const rec = this.currRec;
            if (typeof rec.data === "string") {
                result += rec.data;
            }
            else {
                let colNames = new Array();
                let colValues = new Array();
                let obj = rec.data;
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        colNames.push(key);
                        colValues.push(obj[key]);
                    }
                }
                let colData = Array();
                for (let i = 0; i < colValues.length; i++) {
                    colData.push(`${colNames[i]}=${this.escapeVal(colValues[i])}`);
                }
                result += colData.join(" AND ");
            }
        }
        return result;
    } // parseWhere
    ////////////////////////////////////////
    //
    //      And
    //
    ////////////////////////////////////////
    parseAnd() {
        let result = "";
        if (this.currRec instanceof operation_1.And) {
            let rec = this.currRec;
            result += " AND ";
            if (rec.value !== undefined) {
                // Special case for null value
                if (rec.value === null) {
                    switch (rec.compare) {
                        case types_1.CompareType.Equal:
                            result += " IS NULL";
                            break;
                        case types_1.CompareType.NotEqual:
                            result += " NOT NULL";
                            break;
                    }
                }
                else {
                    result += query_utils_1.QueryUtils.parseCompareType(rec.column, rec.value, rec.compare);
                }
            }
        }
        return result;
    }
    ////////////////////////////////////////
    //
    //  Order
    //
    ///////////////////////////////////////
    parseOrderBy() {
        let result = "";
        if (this.currRec instanceof operation_1.OrderBy) {
            let rec = this.currRec;
            if (this.prevRec instanceof operation_1.OrderBy) {
                result += ", ";
            }
            else {
                result += " ORDER BY ";
            }
            result += rec.fieldName;
            if (rec.orderType !== types_1.OrderType.None) {
                switch (rec.orderType) {
                    case types_1.OrderType.Asc:
                        result += " ASC";
                        break;
                    case types_1.OrderType.Desc:
                        result += " DESC";
                        break;
                }
            }
        }
        return result;
    } // end parseOrderBy
    ////////////////////////////////////////
    //
    //  Limit
    //
    ///////////////////////////////////////
    parseLimit() {
        let result = "";
        if (this.currRec instanceof operation_1.Limit) {
            const rec = this.currRec;
            result += " LIMIT " + rec.fromValue;
            if (rec.toValue != null) {
                result += ", " + rec.toValue;
            }
        }
        return result;
    } // end parseLimit
}
exports.QueryIgniter = QueryIgniter;
//# sourceMappingURL=query-igniter.js.map
