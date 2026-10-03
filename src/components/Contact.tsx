import { useState, type FormEvent } from "react";
import { Button, Callout, FormGroup, HTMLSelect, Icon, InputGroup, TextArea } from "@blueprintjs/core";
import { CONTACT_EMAIL, OFFERINGS } from "../data/site";
import { SectionHead } from "./SectionHead";

const VEHICLES = ["RFP", "RFQ", "RFSO / Standing offer", "Supply arrangement", "Sole-source / ACAN", "Other"];

export function Contact() {
  const [form, setForm] = useState({ name: "", org: "", email: "", ref: "", vehicle: VEHICLES[0], division: "Not sure", closing: "", notes: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: { currentTarget: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.currentTarget.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Tender: ${form.ref || "New solicitation"} | ${form.org}`;
    const body = [
      `Name: ${form.name}`,
      `Organization: ${form.org}`,
      `Email: ${form.email}`,
      `Solicitation ref: ${form.ref}`,
      `Vehicle: ${form.vehicle}`,
      `Offering: ${form.division}`,
      `Closing date: ${form.closing}`,
      "",
      form.notes,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="ae-section" id="contact">
      <div className="wrap">
        <SectionHead title="Send us a solicitation." />
        <div className="ae-contact">
          <div className="ae-panel">
            <div className="ae-panel-head">
              <span className="title mono caps">
                <Icon icon="info-sign" size={12} /> Tenders desk
              </span>
            </div>
            <div className="ae-panel-body ae-contact-copy">
              <h3>Invite Aeygis to bid, or request a capability brief.</h3>
              <p>
                Share the solicitation reference and closing date. We route it to the owning division and confirm a
                bid / no-bid decision.
              </p>
              <dl className="ae-kv">
                <dt>Inbox</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </dd>
                <dt>Vehicles</dt>
                <dd>RFP · RFQ · RFSO · SA</dd>
                <dt>Security</dt>
                <dd>CPCSC Level 1 audits, 2027 program</dd>
              </dl>
            </div>
          </div>

          <form className="ae-panel ae-form" onSubmit={submit}>
            <div className="ae-panel-head">
              <span className="title mono caps">
                <Icon icon="form" size={12} /> Solicitation intake
              </span>
              <span className="mono faint">FORM-01</span>
            </div>
            <div className="ae-panel-body">
              {sent && (
                <Callout intent="success" icon="tick" compact style={{ marginBottom: 10 }}>
                  Your email client should now be open with the details filled in.
                </Callout>
              )}
              <div className="ae-form-row">
                <FormGroup label="Name" labelFor="f-name">
                  <InputGroup id="f-name" required value={form.name} onChange={set("name")} />
                </FormGroup>
                <FormGroup label="Organization" labelFor="f-org">
                  <InputGroup id="f-org" required value={form.org} onChange={set("org")} />
                </FormGroup>
              </div>
              <div className="ae-form-row">
                <FormGroup label="Email" labelFor="f-email">
                  <InputGroup id="f-email" type="email" required leftIcon="envelope" value={form.email} onChange={set("email")} />
                </FormGroup>
                <FormGroup label="Solicitation ref" labelFor="f-ref">
                  <InputGroup id="f-ref" placeholder="e.g. W1234-25XXXX" className="mono" value={form.ref} onChange={set("ref")} />
                </FormGroup>
              </div>
              <div className="ae-form-row">
                <FormGroup label="Vehicle" labelFor="f-vehicle">
                  <HTMLSelect id="f-vehicle" fill options={VEHICLES} value={form.vehicle} onChange={set("vehicle")} />
                </FormGroup>
                <FormGroup label="Offering" labelFor="f-division">
                  <HTMLSelect
                    id="f-division"
                    fill
                    options={["Not sure", ...OFFERINGS.map((o) => o.name)]}
                    value={form.division}
                    onChange={set("division")}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Closing date" labelFor="f-closing">
                <InputGroup id="f-closing" type="date" value={form.closing} onChange={set("closing")} />
              </FormGroup>
              <FormGroup label="Scope / notes" labelFor="f-notes">
                <TextArea id="f-notes" fill rows={4} value={form.notes} onChange={set("notes")} />
              </FormGroup>
              <Button type="submit" className="ae-cta" endIcon="send-message" text="Send to tenders desk" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
