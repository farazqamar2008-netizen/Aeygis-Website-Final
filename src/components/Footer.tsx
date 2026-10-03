import { CONTACT_EMAIL, OFFERINGS } from "../data/site";
import { Link } from "../router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="ae-footer">
      <div className="wrap">
        <div className="ae-footer-grid">
          <div>
            <Logo height={22} />
            <p className="muted" style={{ maxWidth: 300, marginTop: 12, lineHeight: 1.6 }}>
              From “aegis”: to act under the protection of. A public-sector prime contractor with four specialist
              offerings.
            </p>
          </div>
          <div>
            <h5 className="mono caps faint">Software &amp; Services</h5>
            <ul>
              {OFFERINGS.map((o) => (
                <li key={o.name}>
                  <Link to={`/${o.slug}`}>{o.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="mono caps faint">Company</h5>
            <ul>
              <li><Link to="/#updates">Updates</Link></li>
              <li><Link to="/#contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mono caps faint">Tenders desk</h5>
            <ul>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="ae-footer-base mono">
          <span>© {new Date().getFullYear()} Aeygis. All rights reserved.</span>
          <span>AEYGIS.COM // CA</span>
        </div>
      </div>
    </footer>
  );
}
