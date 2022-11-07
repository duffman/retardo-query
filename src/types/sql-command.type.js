"use strict";
/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 08:45
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.olle = exports.SqlCommands = exports.f = exports.QueryOp = exports.QLDialect = void 0;
var QLDialect;
(function (QLDialect) {
    QLDialect[QLDialect["MySQL"] = 0] = "MySQL";
    QLDialect[QLDialect["PostgreSQL"] = 1] = "PostgreSQL";
    QLDialect[QLDialect["SQLite"] = 2] = "SQLite";
    QLDialect[QLDialect["Cassandra"] = 3] = "Cassandra";
})(QLDialect = exports.QLDialect || (exports.QLDialect = {}));
var QueryOp;
(function (QueryOp) {
    QueryOp[QueryOp["SubQuery"] = 0] = "SubQuery";
    QueryOp[QueryOp["Create"] = 1] = "Create";
    QueryOp[QueryOp["Table"] = 2] = "Table";
    QueryOp[QueryOp["Explain"] = 3] = "Explain";
    QueryOp[QueryOp["Insert"] = 4] = "Insert";
    QueryOp[QueryOp["Update"] = 5] = "Update";
    QueryOp[QueryOp["MySqlReplace"] = 6] = "MySqlReplace";
    QueryOp[QueryOp["Select"] = 7] = "Select";
    QueryOp[QueryOp["SelectRaw"] = 8] = "SelectRaw";
    QueryOp[QueryOp["SelectAvg"] = 9] = "SelectAvg";
    QueryOp[QueryOp["SelectMin"] = 10] = "SelectMin";
    QueryOp[QueryOp["SelectMax"] = 11] = "SelectMax";
    QueryOp[QueryOp["SelectCount"] = 12] = "SelectCount";
    QueryOp[QueryOp["Join"] = 13] = "Join";
    QueryOp[QueryOp["LeftJoin"] = 14] = "LeftJoin";
    QueryOp[QueryOp["RightJoin"] = 15] = "RightJoin";
    QueryOp[QueryOp["With"] = 16] = "With";
    QueryOp[QueryOp["Where"] = 17] = "Where";
    QueryOp[QueryOp["WhereRaw"] = 18] = "WhereRaw";
    QueryOp[QueryOp["WhereIn"] = 19] = "WhereIn";
    QueryOp[QueryOp["WhereNotIn"] = 20] = "WhereNotIn";
    QueryOp[QueryOp["OrWhere"] = 21] = "OrWhere";
    QueryOp[QueryOp["OrWhereIn"] = 22] = "OrWhereIn";
    QueryOp[QueryOp["OrWhereNotIn"] = 23] = "OrWhereNotIn";
    QueryOp[QueryOp["WhereBetween"] = 24] = "WhereBetween";
    // XX - Group
    QueryOp[QueryOp["GroupStart"] = 25] = "GroupStart";
    QueryOp[QueryOp["OrGroupStart"] = 26] = "OrGroupStart";
    QueryOp[QueryOp["NotGroupStart"] = 27] = "NotGroupStart";
    QueryOp[QueryOp["OrNotGroupStart"] = 28] = "OrNotGroupStart";
    QueryOp[QueryOp["GroupEnd"] = 29] = "GroupEnd";
    // XX - Like
    QueryOp[QueryOp["Like"] = 30] = "Like";
    QueryOp[QueryOp["OrLike"] = 31] = "OrLike";
    QueryOp[QueryOp["OrNotLike"] = 32] = "OrNotLike";
    // XX - Having
    QueryOp[QueryOp["Having"] = 33] = "Having";
    QueryOp[QueryOp["OrHaving"] = 34] = "OrHaving";
    // And
    QueryOp[QueryOp["And"] = 35] = "And";
    QueryOp[QueryOp["Union"] = 36] = "Union";
    QueryOp[QueryOp["In"] = 37] = "In";
    QueryOp[QueryOp["Distinct"] = 38] = "Distinct";
    QueryOp[QueryOp["From"] = 39] = "From";
    QueryOp[QueryOp["Set"] = 40] = "Set";
    QueryOp[QueryOp["Drop"] = 41] = "Drop";
    QueryOp[QueryOp["Delete"] = 42] = "Delete";
    QueryOp[QueryOp["Truncate"] = 43] = "Truncate";
    QueryOp[QueryOp["EmptyTable"] = 44] = "EmptyTable";
    QueryOp[QueryOp["Limit"] = 45] = "Limit";
    QueryOp[QueryOp["OrderBy"] = 46] = "OrderBy";
})(QueryOp = exports.QueryOp || (exports.QueryOp = {}));
function f() {
}
exports.f = f;
exports.SqlCommands = [
    QueryOp.Create,
    QueryOp.Insert,
    QueryOp.Update,
    QueryOp.Delete
];
class olle {
}
exports.olle = olle;
//# sourceMappingURL=sql-command.type.js.map