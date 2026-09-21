// The comic palette, light ("paper") theme — the same values as the `:root` block in globals.css.
//
// This exists because CSS custom properties can't reach `next/og`: ImageResponse renders through
// Satori, which needs literal colours. All four OG routes used to hardcode their own copies, so a
// palette change updated the site and silently left every social card on the old colours.
//
// globals.css stays authoritative for the page. Change a value here and there together — there is
// no way to derive one from the other at build time, which is exactly why this file is short and
// carries this warning.
export const comic = {
  paper: '#fdf3e3',
  paper2: '#fff8ec',
  ink: '#14100c',
  inkSoft: '#423a30',
  muted: '#6b6154',

  pop: '#ffcf33', // signature yellow
  pop2: '#ff5d55', // red — map pins
  pop3: '#3b6cff', // blue
  pop4: '#12b981', // green
  pop5: '#ff9f1c', // amber — visited countries

  panel: '#ffffff',
  panel2: '#fff4dc',
};

// Only the tokens something outside globals.css actually needs. The OG cards are drawn on paper in
// both themes, so this is just the page background for <meta name="theme-color">.
export const comicDark = {
  paper: '#14161f',
};

// The halftone dot field the OG cards share. Slightly stronger than the page's --dot, because the
// cards are viewed small and scaled down in a timeline.
export const halftone = 'radial-gradient(rgba(20,16,12,0.16) 2px, transparent 2px)';
export const halftoneSize = '26px 26px';
