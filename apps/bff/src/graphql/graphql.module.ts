import { GraphQLModule } from "@nestjs/graphql";

import { StitchingModule } from "./stitching/stitching.module";
import { StitchingService } from "./stitching/stitching.service";

import { GraphqlOptions } from "./graphql.options";
import { ApolloDriver } from "@nestjs/apollo";

export default GraphQLModule.forRootAsync({
	imports: [StitchingModule],
	useClass: GraphqlOptions,
	inject: [StitchingService],
	driver: ApolloDriver,
});
