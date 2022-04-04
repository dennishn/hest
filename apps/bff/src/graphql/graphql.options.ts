import { stitchSchemas } from "@graphql-tools/stitch";
import { Injectable } from "@nestjs/common";
import { GqlOptionsFactory } from "@nestjs/graphql";

import { Request } from "express";

import { StitchingService } from "./stitching/stitching.service";
import { AppConfig, GraphQLConfig } from "../types/Config";
import { ConfigService } from "@nestjs/config";
import { GraphQLSchema } from "graphql";

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
	constructor(
		private readonly stitchingService: StitchingService,
		private readonly configService: ConfigService
	) {}

	public createGqlOptions() {
		const appSettings = this.configService.get<AppConfig>("APP_SETTINGS");
		const graphqlSettings =
			this.configService.get<GraphQLConfig>("GRAPHQL_SETTINGS");

		return {
			...graphqlSettings,
			typePaths: ["./**/*.graphql"],
			context: ({ req }: { req: Request }) => ({ req }),
			bodyParserConfig: {
				limit: appSettings?.bodyLimit,
			},
			transformSchema: async (schema: GraphQLSchema) => {
				try {
					const schemas: GraphQLSchema[] = [
						schema,
						...(await this.stitchingService.schemas()).filter(Boolean),
					];
					return stitchSchemas({
						subschemas: schemas,
					});
				} catch (e) {
					throw e;
				}
			},
		};
	}
}
