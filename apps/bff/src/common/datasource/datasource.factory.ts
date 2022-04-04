import CommercetoolsDataSource from "./datasource.commercetools";
import TokenDataSource from "./datasource.token";
import { ConfigService } from "@nestjs/config";
import { DataSourceSettings, DataSource } from "./types/datasource";
export default class DataSourceFactory {
	getDataSource(
		config: DataSourceSettings,
		configService: ConfigService
	): DataSource {
		switch (config.strategy) {
			case "commercetools":
				return new CommercetoolsDataSource(config);
			case "token":
				return new TokenDataSource(config, configService);
		}
	}
}
