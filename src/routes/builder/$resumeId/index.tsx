import { createFileRoute } from "@tanstack/react-router";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ResumePreview } from "@/components/resume/preview";
import { BuilderDock } from "./-components/dock";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="fixed inset-0">
			<TransformWrapper centerOnInit limitToBounds={false} minScale={0.3} initialScale={0.6} maxScale={6}>
				<TransformComponent wrapperClass="h-full! w-full!">
					<ResumePreview
						showPageNumbers
						className="flex items-start space-x-10 space-y-10"
						pageClassName="shadow-xl rounded-md overflow-hidden"
					/>
				</TransformComponent>

				<BuilderDock />
			</TransformWrapper>
		</div>
	);
}
