export default function Home({ shop, onNavigate }) {
  return (
    <div className="home">
      <section className="home-hero">
        <h1>{shop.name}</h1>
        <p className="home-lead">{shop.claim}</p>
      </section>
      <section className="home-visit">
        <h2>Visit us</h2>
        <address>
          {shop.address.street}
          <br />
          {shop.address.city}
        </address>
        <p>
          <a href={`tel:${shop.phone.replaceAll(' ', '')}`}>{shop.phone}</a>
        </p>
        <button type="button" className="home-cta" onClick={() => onNavigate('contact')}>
          Opening hours &amp; contact →
        </button>
      </section>
    </div>
  )
}
