/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 08:45
 */

export enum QLDialect {
	MySQL,
	PostgreSQL,
	SQLite,
	Cassandra
}

export enum QueryOp {
	SubQuery,
	Create,
	Table,
	Explain,
	Insert,
	Update,
	MySqlReplace,
	Select,
	SelectRaw,
	SelectAvg,
	SelectMin,
	SelectMax,
	SelectCount,
	Join,
	LeftJoin,
	RightJoin,
	With,

	Where,
	WhereRaw,
	WhereIn,
	WhereNotIn,
	Or,
	OrWhere,
	OrWhereIn,
	OrWhereNotIn,
	WhereBetween,

	// XX - Group
	GroupStart,
	OrGroupStart,
	NotGroupStart,
	OrNotGroupStart,
	GroupEnd,

	// XX - Like
	Like,
	OrLike,
	OrNotLike,

	// XX - Having
	Having,
	OrHaving,

	// And

	And,
	Union,
	In,
	Distinct,
	From,
	Set,
	Drop,
	Delete,
	Truncate,
	EmptyTable,
	Limit,
	OrderBy
}

export function f() {

}

export type SqlCommandsa = QueryOp[];

export const SqlCommands = [
	QueryOp.Create,
	QueryOp.Insert,
	QueryOp.Update,
	QueryOp.Delete
];

export class olle {

}
