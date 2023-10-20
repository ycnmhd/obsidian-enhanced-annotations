import { FontFamily } from '../../../../settings-type';

type Attributes = { fontWeight?: 400 | 500 | 600; fontFamily?: FontFamily };
export const TextSVG = (text: string, attributes?: Attributes) => {
    const { fontWeight = 400, fontFamily = 'sans-serif' } = attributes || {};
    return `
	<svg
	  class="svg-icon"
	  xmlns="http://www.w3.org/2000/svg"
	  width="24"
	  height="24"
	  viewBox="0 0 24 24"
	  fill="none"
	  stroke="currentColor"
	  stroke-width="2"
	  stroke-linecap="round"
	  stroke-linejoin="round"
	>
			<text
			  font-family="${fontFamily}"
			  font-size="20px"
			  font-weight="${fontWeight}" x="${text.length === 1 ? 5 : 0}" y="19"
			  fill="currentColor"
			  stroke="none">${text}</text>
	</svg>
		`;
};
