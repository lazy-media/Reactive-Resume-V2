import { match } from "ts-pattern";
import type { SectionType } from "@/schema/resume/data";
import { AwardsItem } from "./items/awards-item";
import { CertificationsItem } from "./items/certifications-item";
import { EducationItem } from "./items/education-item";
import { ExperienceItem } from "./items/experience-item";
import { InterestsItem } from "./items/interests-item";
import { LanguagesItem } from "./items/languages-item";
import { ProfilesItem } from "./items/profiles-item";
import { ProjectsItem } from "./items/projects-item";
import { PublicationsItem } from "./items/publications-item";
import { ReferencesItem } from "./items/references-item";
import { SkillsItem } from "./items/skills-item";
import { VolunteerItem } from "./items/volunteer-item";
import { PageCustomSection } from "./page-custom";
import { PageSection } from "./page-section";
import { PageSummary } from "./page-summary";

type SectionComponentProps = {
	sectionClassName?: string;
	itemClassName?: string;
};

export function getSectionComponent(
	section: "summary" | SectionType | (string & {}),
	{ sectionClassName, itemClassName }: SectionComponentProps = {},
) {
	return match(section)
		.with("summary", () => {
			const SummarySection = ({ id: _id }: { id: string }) => <PageSummary className={sectionClassName} />;
			return SummarySection;
		})
		.with("profiles", () => {
			const ProfilesSection = ({ id: _id }: { id: string }) => (
				<PageSection type="profiles" className={sectionClassName}>
					{(item) => <ProfilesItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return ProfilesSection;
		})
		.with("experience", () => {
			const ExperienceSection = ({ id: _id }: { id: string }) => (
				<PageSection type="experience" className={sectionClassName}>
					{(item) => <ExperienceItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return ExperienceSection;
		})
		.with("education", () => {
			const EducationSection = ({ id: _id }: { id: string }) => (
				<PageSection type="education" className={sectionClassName}>
					{(item) => <EducationItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return EducationSection;
		})
		.with("projects", () => {
			const ProjectsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="projects" className={sectionClassName}>
					{(item) => <ProjectsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return ProjectsSection;
		})
		.with("skills", () => {
			const SkillsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="skills" className={sectionClassName}>
					{(item) => <SkillsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return SkillsSection;
		})
		.with("languages", () => {
			const LanguagesSection = ({ id: _id }: { id: string }) => (
				<PageSection type="languages" className={sectionClassName}>
					{(item) => <LanguagesItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return LanguagesSection;
		})
		.with("interests", () => {
			const InterestsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="interests" className={sectionClassName}>
					{(item) => <InterestsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return InterestsSection;
		})
		.with("awards", () => {
			const AwardsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="awards" className={sectionClassName}>
					{(item) => <AwardsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return AwardsSection;
		})
		.with("certifications", () => {
			const CertificationsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="certifications" className={sectionClassName}>
					{(item) => <CertificationsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return CertificationsSection;
		})
		.with("publications", () => {
			const PublicationsSection = ({ id: _id }: { id: string }) => (
				<PageSection type="publications" className={sectionClassName}>
					{(item) => <PublicationsItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return PublicationsSection;
		})
		.with("volunteer", () => {
			const VolunteerSection = ({ id: _id }: { id: string }) => (
				<PageSection type="volunteer" className={sectionClassName}>
					{(item) => <VolunteerItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return VolunteerSection;
		})
		.with("references", () => {
			const ReferencesSection = ({ id: _id }: { id: string }) => (
				<PageSection type="references" className={sectionClassName}>
					{(item) => <ReferencesItem {...item} className={itemClassName} />}
				</PageSection>
			);
			return ReferencesSection;
		})
		.otherwise(() => {
			const CustomSection = ({ id }: { id: string }) => (
				<PageCustomSection sectionId={id} className={sectionClassName} />
			);
			return CustomSection;
		});
}
