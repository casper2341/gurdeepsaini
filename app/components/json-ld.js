// The one place structured data gets injected into a page.
//
// Escaping '<' is the whole point: without it, any '<' that reaches the data — in a job title, a
// spot's note, a district name from the boundary file — closes the <script> tag early and the
// browser parses the rest of the JSON as HTML. '<' is still a valid '<' to a JSON parser, so
// crawlers read exactly what was meant. Three of the four call sites already did this by hand; this
// component exists so the fourth can't forget.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
