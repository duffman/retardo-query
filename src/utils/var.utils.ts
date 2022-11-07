/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 *
 * Created by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * File Date: 2020-04-02 15:20
 */

import { QueryOp }            from "../types/sql-command.type";
import { SqlWhere }           from "../types/types";
import { IDRecord }           from "../types/types";
import { VarType }            from "./query-utils";
import { Where, WhereSimple } from "../components/where";

export class VarUtils {
	public static getVarType(value: any): VarType {
		let result: VarType = VarType.None;

		if (value === undefined || value === null) {
			return VarType.NullOrUndefined;
		}

		switch (typeof value) {
			case "string":
				result = VarType.String;
				break;

			case "boolean":
				result = VarType.Boolean;
				break;

			case "number":
				result = VarType.Number;
				break;

			case "object":
				if (value instanceof Date) {
					result = VarType.Date;
				} else if (Array.isArray(value)) {
					result = VarType.Array;
				} else if (Buffer.isBuffer(value)) {
					result = VarType.Buffer;
				} else {
					result = VarType.Object;
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
	public static haveStrValue(value: any): boolean {
		const varType = VarUtils.getVarType(value);

		return value !== undefined && varType === VarType.String && (value as string).length > 0;
	}

	public static isNull(value: any): boolean {
		return !value ?? true;
	}

	public static isNotNull(value: any): boolean {
		return !VarUtils.isNull(value);
	}

	public static isWhereRec(record: IDRecord | null): boolean {
		return record !== null && record.command in SqlWhere;
	}
}
