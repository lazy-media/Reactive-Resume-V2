import { LevelDisplay } from "@/components/level/display";
import { useResumeStore } from "../store/resume";

type Props = React.ComponentProps<"div"> & {
	level: number;
};

export function PageLevel({ level, className, ...props }: Props) {
	const { icon, type } = useResumeStore((state) => state.resume.data.metadata.design.level);

	return <LevelDisplay icon={icon} type={type} level={level} className={className} {...props} />;
}
