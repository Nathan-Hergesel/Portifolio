import { Fragment } from "react";
import { constructionSections } from "../data/site";

const BAND_TEXT = "Site em construção · Site em construção · Site em construção";

function SectionTitle({ lines }) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function ConstructionBand({ screenReaderText }) {
  return (
    <div className="construction-band reveal">
      <span aria-hidden="true">{BAND_TEXT}</span>
      <p className="sr-only">{screenReaderText}</p>
    </div>
  );
}

function ConstructionHeading({ section, titleId }) {
  const headingContent = (
    <>
      <span className="section-code">{section.code}</span>
      <h2 id={titleId}>
        <SectionTitle lines={section.title} />
      </h2>
    </>
  );

  return (
    <div className={`${section.headingClassName} construction-heading reveal`.trim()}>
      {section.nestedHeading ? <div>{headingContent}</div> : headingContent}
      {section.description && <p>{section.description}</p>}
    </div>
  );
}

export function ConstructionSections() {
  return constructionSections.filter((section) => section.id !== "projetos").map((section, index) => {
    const sectionKey = section.id ?? `section-${index}`;
    const titleId = `${section.id ?? "social"}-title`;

    return (
      <section
        className={`${section.className} section under-construction`}
        id={section.id}
        aria-labelledby={titleId}
        key={sectionKey}
      >
        <ConstructionHeading section={section} titleId={titleId} />
        <ConstructionBand screenReaderText={section.screenReaderText} />
      </section>
    );
  });
}
