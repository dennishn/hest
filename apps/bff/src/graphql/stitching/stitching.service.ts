import { GraphQLSchema, print } from "graphql";
import {
	RenameTypes,
	RenameObjectFields,
	wrapSchema,
	introspectSchema,
} from "@graphql-tools/wrap";
import { Injectable } from "@nestjs/common";
import DataSourceFactory from "../../common/datasource/datasource.factory";
import "cross-fetch";
import { AsyncExecutor } from "@graphql-tools/utils";
import { ConfigService } from "@nestjs/config";
import {
	DataSources,
	DataSource,
} from "src/common/datasource/types/datasource";

const conflicts = ["Query.product", "Asset.description"];

@Injectable()
export class StitchingService {
	constructor(private readonly configService: ConfigService) {
		this.schemas = this.schemas.bind(this);
		this.getApiSchema = this.getApiSchema.bind(this);
	}

	public async schemas(): Promise<Array<GraphQLSchema>> {
		const datasourceSettings = this.configService.get<DataSources>(
			"DATASOURCE_SETTINGS"
		);

		const dataSourceFactory = new DataSourceFactory();

		return Promise.all(
			Object.values(datasourceSettings!.datasources).map((datasource) => {
				return this.getApiSchema(
					dataSourceFactory.getDataSource(datasource, this.configService)
				);
			})
		);
	}

	private async getApiSchema(dataSource: DataSource): Promise<GraphQLSchema> {
		const namespace = dataSource.namespace;
		try {
			const remoteExecutor: AsyncExecutor = async ({
				document,
				variables,
				context,
			}) => {
				const query = print(document);

				return await dataSource.fetch(query, variables, context);
			};

			const schema = await introspectSchema(remoteExecutor);

			return wrapSchema({
				schema,
				executor: remoteExecutor,
				transforms: [
					// By namespace prefixing types we avoid naming collions on types between datasources
					// We have an 'Asset' in both contentful and commercetools, but they have different fields.
					// In this case, we do not get a warning about this, but we might get a runtime error when we try to use the type.
					// Graphql will merge silently the two conflicting definitions - so instead we use namespace prefixing.
					new RenameTypes((name) => {
						if (!["Asset"].includes(name)) {
							return name;
						}
						return `${namespace}_${name}`;
					}),
					// Here we can rename object fields that conflicts between datasources.
					// If we don't rename them, we will get a warning from graphql, so it is transparent,
					// if we introduce new conflicts.
					new RenameObjectFields((typeName, fieldName) => {
						for (const conflict of conflicts) {
							if (conflict === `${typeName}.${fieldName}`) {
								return `${namespace}_${fieldName}`;
							}
						}
						return fieldName;
					}),
				],
			});
		} catch (error) {
			throw error;
		}
	}
}
