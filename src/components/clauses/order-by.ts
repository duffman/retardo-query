/**
 * Graphmin CLI Tool
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-03
 *
 * Copyright (c) 2022 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { QueryOp }     from "../../types/sql-command.type";
import { QueryClause } from "./clause";

export class OrderBy extends QueryClause<QueryOp.OrderBy> {
	constructor(
		public column: string,
		public asc: boolean) {
		super(column);
	}
}
