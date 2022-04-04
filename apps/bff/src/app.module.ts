import { Module } from "@nestjs/common";
import GraphQLModule from "./graphql/graphql.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
		}),
		GraphQLModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
