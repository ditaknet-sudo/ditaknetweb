export function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <div className="site-bg__base" />
      <div className="site-bg__wash" />
      <div className="site-bg__grid" />
      <div className="site-bg__orb site-bg__orb--a" />
      <div className="site-bg__orb site-bg__orb--b" />
      <div className="site-bg__orb site-bg__orb--c" />
      <div className="site-bg__orb site-bg__orb--d" />
      <div className="site-bg__beam site-bg__beam--a" />
      <div className="site-bg__beam site-bg__beam--b" />
      <div className="site-bg__beam site-bg__beam--c" />
      <div className="site-bg__particles">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`site-bg__particle site-bg__particle--${(index % 6) + 1}`} />
        ))}
      </div>
      <div className="site-bg__nodes">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="site-bg__vignette" />
    </div>
  );
}
