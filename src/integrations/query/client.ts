import { StandardRPCJsonSerializer } from "@orpc/client/standard";
import { MutationCache, QueryClient } from "@tanstack/react-query";

const serializer = new StandardRPCJsonSerializer();

export const getQueryClient = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: 5 * 60 * 1000, // 5 minutes
				staleTime: 60 * 1000, // 1 minute
				queryKeyHashFn(queryKey) {
					const [json, meta] = serializer.serialize(queryKey);
					return JSON.stringify({ json, meta });
				},
			},
			dehydrate: {
				serializeData(data) {
					const [json, meta] = serializer.serialize(data);
					return { json, meta };
				},
			},
			hydrate: {
				deserializeData(data) {
					return serializer.deserialize(data.json, data.meta);
				},
			},
		},
		mutationCache: new MutationCache({
			onSettled: () => {
				queryClient.invalidateQueries();
			},
		}),
	});

	return queryClient;
};
