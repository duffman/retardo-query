/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-27 11:25
 */


import { Query } from "./components/query";

let query = new Query().select("olle", "nisse", "kalle")
						.from("users", "snorre", "nisse")
						.where(
							{
								s     : 23,
								"rine": false,
								knacke: "påd"

							}
						)
					//   .orderBy("s");

console.log("dsf ::", query);
